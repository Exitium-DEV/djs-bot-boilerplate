import type {
	RoleSelectMenuBuilder,
	UserSelectMenuBuilder,
	StringSelectMenuBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	AnySelectMenuInteraction,
 } from "discord.js";

export type AnySelectMenuBuilder = RoleSelectMenuBuilder | UserSelectMenuBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder;

export interface SelectMenu {
	data: AnySelectMenuBuilder;
	execute: (interaction: AnySelectMenuInteraction) => Promise<any>;
}