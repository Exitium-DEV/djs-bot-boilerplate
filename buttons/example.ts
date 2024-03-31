import { type Button } from "../types/Button";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export default {
	data: new ButtonBuilder()
		.setLabel("Click me!")
		.setStyle(ButtonStyle.Primary),
	
	execute: async (interaction) => {
		await interaction.reply("Button clicked!");
	},
} satisfies Button;