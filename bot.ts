import { GatewayIntentBits } from "discord.js";
import { Client, ClientFeatureFlagBits } from "./utilities/Client";

const client = new Client({
	features: ClientFeatureFlagBits.SENTRY | ClientFeatureFlagBits.REDIS | ClientFeatureFlagBits.MONGO,
	intents: [
		GatewayIntentBits.Guilds,
	],
});

await client.login(process.env.DISCORD_BOT_TOKEN);