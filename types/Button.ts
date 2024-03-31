import type { ButtonBuilder, ButtonInteraction } from "discord.js";
import type { InteractionClientOverride } from "./InteractionClientOverride";

export interface Button {
	data: ButtonBuilder;
	execute: (interaction: InteractionClientOverride<ButtonInteraction>) => Promise<any>;
}