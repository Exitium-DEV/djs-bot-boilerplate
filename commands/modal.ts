import {
	SlashCommandBuilder,
} from "discord.js";

import type { Command } from "../types/Command";

export default {
	data: new SlashCommandBuilder()																// REQUIRED, name is inferred from file name
		.setDescription("Sends a modal!"),
	
	execute: async (interaction) => {															// REQUIRED, what should the command do?
		const modal = interaction.client.components.modals.get("example");						// OPTIONAL, get the modal object from the client (defined in components/modals/example.ts)

		if (!modal) {
			return interaction.reply({
				content: "Modal not found!",
				ephemeral: true,
			});
		};

		await interaction.showModal(modal.data);
	},
} satisfies Command;																			// OPTIONAL, used for type checking, shows errors if the object is not the right format