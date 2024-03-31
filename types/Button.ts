import type { ButtonBuilder, ButtonInteraction } from "discord.js";

export interface Button {
	data: ButtonBuilder;
	execute: (interaction: ButtonInteraction) => Promise<any>;
}