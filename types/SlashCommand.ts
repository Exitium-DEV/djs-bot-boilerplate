import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { InteractionClientOverride } from "./InteractionClientOverride";

export interface SlashCommand {
	permission?: (interaction: InteractionClientOverride<ChatInputCommandInteraction>) => Promise<boolean>;
	data: SlashCommandBuilder;
	execute: (interaction: InteractionClientOverride<ChatInputCommandInteraction>) => Promise<any>;
}