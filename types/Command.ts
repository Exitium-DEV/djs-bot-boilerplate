import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
	permission?: (interaction?: ChatInputCommandInteraction) => boolean;
	data: SlashCommandBuilder;
	execute: (interaction?: ChatInputCommandInteraction) => Promise<void>;
}