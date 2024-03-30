import { GatewayIntentBits } from "discord.js";
import { Client, ClientFeatureFlags } from "./utilities/Client";

const client = new Client({
	features: ClientFeatureFlags.SENTRY | ClientFeatureFlags.REDIS | ClientFeatureFlags.MONGO,
	intents: [
		GatewayIntentBits.Guilds,
	],
});

await client.login(process.env.DISCORD_BOT_TOKEN);