import { type Button } from "../types/Button";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export default {
	data: new ButtonBuilder()									// REQUIRED, name is inferred from file name
		.setLabel("Click me!")
		.setStyle(ButtonStyle.Primary),
	
	execute: async (interaction) => {							// REQUIRED, what should the button do?
		await interaction.reply("Button clicked!");
	},
} satisfies Button;