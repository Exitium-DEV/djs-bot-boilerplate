import {
	Client as DiscordClient,
	type ClientOptions, Collection, SlashCommandBuilder, type APIButtonComponentWithCustomId, type APIButtonComponentWithURL,
} from "discord.js";

import * as Sentry from "@sentry/node";
import Redis from "./Redis";
import Mongo from "./Mongo";
import { readdirSync } from "node:fs";
import type { Command } from "../types/Command";
import type { Button } from "../types/Button";
import type { AnySelectMenuBuilder, SelectMenu } from "../types/SelectMenu";
import { join as pathJoin } from "node:path";

export enum ClientFeatureFlagBits {
	SENTRY = 1 << 0,
	REDIS = 1 << 1,
	MONGO = 1 << 2,
}

interface Options extends ClientOptions {
	features: number;
}

export class Client extends DiscordClient {
	commands: Collection<string, Command>;
	components: {
		buttons: Collection<string, Button>;
		selectMenus: Collection<string, SelectMenu>;
	};
	sentry?: typeof Sentry;
	redis?: ReturnType<typeof Redis>;
	mongo?: ReturnType<typeof Mongo>;

	constructor(options: Options) {
		super(options);

		this.commands = new Collection();
		this.components = {
			buttons: new Collection(),
			selectMenus: new Collection(),
		}

		this.init(options.features).catch(this.handleError);
	}

	public handleError = (error: any) => {
		const errorId = this.sentry?.captureException(error);
		console.error(error);
		return errorId;
	}

	private async init(flags: number) {
		if (flags & ClientFeatureFlagBits.SENTRY) this.initSentry();
		if (flags & ClientFeatureFlagBits.REDIS) await this.initRedis();
		if (flags & ClientFeatureFlagBits.MONGO) await this.initMongo();

		await this.registerEvents();
		await this.loadCommands();
		await this.loadButtons();
		await this.loadSelectMenus();

		if(!this.isReady()) await new Promise(resolve => this.once("ready", resolve));

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

			const { data: commandBuilder }: { data: SlashCommandBuilder } = command;
			const commandName = commandBuilder.name ?? file.split(".")[0].toLowerCase();
			
			try {
				commandBuilder.setName(commandName);
			}

			catch {
				console.error(`[COMMANDS] Command '${file}' has an invalid name`);
				return;
			}
			
			this.commands.set(commandName, command);

			console.log(`[COMMANDS] Loaded handler: ${commandName}`);
		});
	}

	private async loadButtons() {
		const buttonFiles = readdirSync("./components/buttons").filter(file => file.endsWith(".js") || file.endsWith(".ts"));

		buttonFiles.forEach(async file => {
			const { default: button }: { default: Button } = await import(`../components/buttons/${file}`);
			if (!button || !button.data || !button.execute) return console.error(`[BUTTONS] Button '${file}' is malformed`);

			const { data: buttonData } = button;
			const buttonName = (buttonData.data as Partial<APIButtonComponentWithCustomId> & Partial<APIButtonComponentWithURL>)?.custom_id ?? file.split(".")[0].toLowerCase();

			try {
				buttonData.setCustomId(buttonName);
			}

			catch {
				console.error(`[COMPONENTS] Button '${file}' has an invalid name`);
				return;
			}

			this.components.buttons.set(buttonName, button);

			console.log(`[COMPONENTS] Loaded button handler: ${buttonName}`);
		})
	}

	private async loadSelectMenus() {
		const selectMenuFiles = readdirSync("./components/selectMenus").filter(file => file.endsWith(".js") || file.endsWith(".ts"));

		selectMenuFiles.forEach(async file => {
			const { default: selectMenu }: { default: SelectMenu } = await import(`../components/selectMenus/${file}`);
			if (!selectMenu || !selectMenu.data || !selectMenu.execute) return console.error(`[SELECTMENUS] Select menu '${file}' is malformed`);

			const { data: selectMenuBuilderData } = selectMenu;
			const selectMenuName = selectMenuBuilderData.data.custom_id ?? file.split(".")[0].toLowerCase();

			try {
				selectMenuBuilderData.setCustomId(selectMenuName);
			}

			catch {
				console.error(`[COMPONENTS] Select menu '${file}' has an invalid name`);
				return;
			}

			this.components.selectMenus.set(selectMenuName, selectMenu);

			console.log(`[COMPONENTS] Loaded select menu handler: ${selectMenuName}`);
		})
	}

	private async loadModules() {
		const modules = readdirSync("./modules").filter(file => file.endsWith(".js") || file.endsWith(".ts"));

		modules.forEach(async file => {
			const { default: moduleEntryPoint } = await import(`../modules/${file}`);
			const moduleName = file.split(".")[0].toLowerCase();

			if (!moduleEntryPoint || typeof moduleEntryPoint != "function") return console.error(`[MODULES] Module '${file}' is malformed`);

			moduleEntryPoint(this).catch(this.handleError);
			console.log(`[MODULES] Loaded module: ${moduleName}`);
		});
	}

	private async deployCommands() {
		const commandsData = this.commands
			.map(command => command.data)
			.sort((a, b) => a.name.localeCompare(b.name));

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
			.then((res) => console.log(`[COMMANDS] Successfully deployed ${res.size} commands`))
			.catch(this.handleError);
	}

	private async registerEvents() {
		const coreEventFiles = readdirSync("./events/.core").filter(file => file.endsWith(".js") || file.endsWith(".ts")).map(file => ({file, isCore: true}));
		const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js") || file.endsWith(".ts")).map(file => ({file, isCore: false}));
		
		for (const eventFile of [...coreEventFiles, ...eventFiles]) {
			const { file, isCore } = eventFile;
			const { default: event } = await import(pathJoin("..", "events", isCore ? ".core" : "", file));
			if (!event || !event.execute) {
				console.error(`[EVENTS] Event '${file}' is malformed`);
				continue;
			};

			const eventName = file.split(".")[0];

			if (event.once) this.once(eventName, (...args) => event.execute(...args));
			else this.on(eventName, (...args) => event.execute(...args));

			console.log(`[EVENTS] Registered event: ${isCore ? 'core.' : ''}${eventName}`);
		}
	}
}