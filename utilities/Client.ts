import {
	Client as DiscordClient,
	type ClientOptions, Collection,
} from "discord.js";

import * as Sentry from "@sentry/node";
import Redis from "./Redis";
import Mongo from "./Mongo";
import { readdirSync } from "node:fs";
import type { Command } from "../types/Command";

export enum ClientFeatureFlags {
	SENTRY = 1 << 0,
	REDIS = 1 << 1,
	MONGO = 1 << 2,
}

interface Options extends ClientOptions {
	features: number;
}

export class Client extends DiscordClient {
	commandData: Collection<string, Command>;
	sentry?: typeof Sentry;
	redis?: ReturnType<typeof Redis>;
	mongo?: ReturnType<typeof Mongo>;

	constructor(options: Options) {
		super(options);

		this.commandData = new Collection();

		this.init(options.features).catch(this.handleError);
	}

	public handleError = (error: any) => {
		const errorId = this.sentry?.captureException(error);
		console.error(error);
		return errorId;
	}

	private async init(flags: number) {
		if (flags & ClientFeatureFlags.SENTRY) this.initSentry();
		if (flags & ClientFeatureFlags.REDIS) await this.initRedis();
		if (flags & ClientFeatureFlags.MONGO) await this.initMongo();

		await this.registerEvents();
		await this.loadCommands();

		await new Promise(resolve => this.once("ready", resolve));

		await this.loadModules();
		await this.deployCommands();
	}

	private initSentry() {
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			environment: process.env.NODE_ENV,
			tracesSampleRate: 1.0,
		});

		this.sentry = Sentry;
	}

	private async initRedis() {
		const RedisClient = Redis();

		RedisClient.on("error", this.handleError);
		RedisClient.on("ready", () => console.log("[REDIS] Connected to Redis"));

		await RedisClient.connect();

		this.redis = RedisClient;
	}

	private async initMongo() {
		this.mongo = Mongo();
		console.log("[MONGO] Connected to MongoDB");
	}

	private async loadCommands() {
		const commandFiles = readdirSync("./commands").filter(file => file.endsWith(".js") || file.endsWith(".ts"));
	
		commandFiles.forEach(async file => {
			const { default: command } = await import(`../commands/${file}`);
			if (!command || !command.data || !command.execute) return console.error(`[COMMANDS] Command '${file}' is malformed`);

			const { data } = command;
			const commandName = file.split(".")[0];
			
			try {
				data.setName(commandName);
			}

			catch {
				console.error(`[COMMANDS] Command '${file}' has an invalid name`);
				return;
			}
			
			this.commandData.set(data.name, command);

			console.log(`[COMMANDS] Loaded handler: ${data.name}`);
		});
	}

	private async loadModules() {
		const modules = readdirSync("./modules").filter(file => file.endsWith(".js") || file.endsWith(".ts"));

		modules.forEach(async file => {
			const { default: module } = await import(`../modules/${file}`);
			if (!module || typeof module != "function") return console.error(`[MODULES] Module '${file}' is malformed`);

			module(this).catch(this.handleError);
			console.log(`[MODULES] Loaded module: ${file.split(".")[0]}`);
		});
	}

	private async deployCommands() {
		const commandsData = this.commandData.map(command => command.data);

		const commandsCacheFile = Bun.file("./commands/.cache");
		if (!await commandsCacheFile.exists()) await Bun.write(commandsCacheFile, "");

		const commandsHashOld = await commandsCacheFile.text();
		const commandsHashNew = Bun.hash(JSON.stringify(commandsData)).toString();

		if (commandsHashOld == commandsHashNew) return console.log("[COMMANDS] No structure changes, skipped deployment");

		await Bun.write(commandsCacheFile, commandsHashNew);

		if (!commandsData.length) return this.application?.commands.set([])
			.then(() => console.log("[COMMANDS] No commands found, cleared deployment"))
			.catch(this.handleError);

		this.application?.commands.set(commandsData)
			.then(() => console.log(`[COMMANDS] Successfully deployed ${commandsData.length} commands`))
			.catch(this.handleError);
	}

	private async registerEvents() {
		const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js") || file.endsWith(".ts"));
		
		for (const file of eventFiles) {
			const { default: event } = await import(`../events/${file}`);
			if (!event || !event.execute) {
				console.error(`[EVENTS] Event '${file}' is malformed`);
				continue;
			};

			const eventName = file.split(".")[0];

			if (event.once) this.once(eventName, (...args) => event.execute(...args));
			else this.on(eventName, (...args) => event.execute(...args));

			console.log(`[EVENTS] Registered event: ${eventName}`);
		}
	}
}