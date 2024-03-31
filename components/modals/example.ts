import { type Modal } from "../../types/Modal";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const textInput = new TextInputBuilder()
	.setCustomId("textInput")
	.setLabel("Enter some text")
	.setStyle(TextInputStyle.Short);

const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
	.addComponents(textInput);

export default {
	data: new ModalBuilder()									// REQUIRED, customId is inferred from file name
		.setTitle("Example Modal")
		.addComponents(firstActionRow),
	
	execute: async (interaction) => {							// REQUIRED, what should submitting the modal do?
		await interaction.reply("Modal submitted!");
	},
} satisfies Modal;