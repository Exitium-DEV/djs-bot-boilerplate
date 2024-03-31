import type {
	RoleSelectMenuBuilder,
	UserSelectMenuBuilder,
	StringSelectMenuBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	AnySelectMenuInteraction,
 } from "discord.js";

 import type { InteractionClientOverride } from "./InteractionClientOverride";

export type AnySelectMenuBuilder = RoleSelectMenuBuilder | UserSelectMenuBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder;

export interface SelectMenu {
	data: AnySelectMenuBuilder;
	execute: (interaction: InteractionClientOverride<AnySelectMenuInteraction>) => Promise<any>;
}