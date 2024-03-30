import { type ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export default {
	permission: () => false,											// OPTIONAL, defaults to true

	data: new SlashCommandBuilder()										// REQUIRED, name is inferred from file name
		.setDescription("Replies with Pong!"),

	execute: async (interaction: ChatInputCommandInteraction) => {		// REQUIRED, what should the command do?
		await interaction.reply("Pong!");
	},
};