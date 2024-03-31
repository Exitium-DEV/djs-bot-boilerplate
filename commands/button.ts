import {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} from "discord.js";

import type { Command } from "../types/Command";
import type { Client } from "../utilities/Client";

export default {
	data: new SlashCommandBuilder()																// REQUIRED, name is inferred from file name
		.setDescription("Sends a button!"),
	
	execute: async (interaction) => {															// REQUIRED, what should the command do?
		const button = interaction.client.components.buttons.get("example");					// OPTIONAL, get the button object from the client (defined in components/buttons/example.ts)

		if (!button) {
			return interaction.reply({
				content: "Button not found!",
				ephemeral: true,
			});
		}

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(button.data);
		
		await interaction.reply({
			components: [row],
		});
	},
} satisfies Command;																			// OPTIONAL, used for type checking, shows errors if the object is not the right format