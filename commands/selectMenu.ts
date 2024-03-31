import {
	SlashCommandBuilder,
	ActionRowBuilder,
} from "discord.js";

import type { Command } from "../types/Command";
import type { Client } from "../utilities/Client";
import type { AnySelectMenuBuilder } from "../types/SelectMenu";

export default {
	data: new SlashCommandBuilder()																// REQUIRED, name is inferred from file name
		.setDescription("Sends a select menu!"),
	
	execute: async (interaction) => {															// REQUIRED, what should the command do?
		const selectMenu = interaction.client.components.selectMenus.get("example");			// OPTIONAL, get the select menu object from the client (defined in components/selectMenus/example.ts)

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
} satisfies Command;																			// OPTIONAL, used for type checking, shows errors if the object is not the right format