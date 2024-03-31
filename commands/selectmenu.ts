import {
	SlashCommandBuilder,
	ActionRowBuilder,
} from "discord.js";

import type { Command } from "../types/Command";
import type { Client } from "../utilities/Client";
import type { AnySelectMenuBuilder } from "../types/SelectMenu";

export default {
	data: new SlashCommandBuilder()
		.setDescription("Sends a select menu!"),
	
	execute: async (interaction) => {
		const client = interaction.client as Client;
		const selectMenu = client.components.selectMenus.get("example");

		if (!selectMenu) {
			return interaction.reply({
				content: "Select menu not found!",
				ephemeral: true,
			});
		}

		const row = new ActionRowBuilder<AnySelectMenuBuilder>()
			.addComponents(selectMenu.data);
		
		await interaction.reply({
			components: [row],
		});
	},
} satisfies Command;