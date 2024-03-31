import {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} from "discord.js";

import type { Command } from "../types/Command";
import type { Client } from "../utilities/Client";

export default {
	data: new SlashCommandBuilder()
		.setDescription("Sends a button!"),
	
	execute: async (interaction) => {
		const client = interaction.client as Client;
		const button = client.buttons.get("example");

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
} satisfies Command;