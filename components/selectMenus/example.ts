import { type SelectMenu } from "../../types/SelectMenu";
import { StringSelectMenuBuilder } from "discord.js";

export default {
	data: new StringSelectMenuBuilder()								// REQUIRED, name is inferred from file name
		.setPlaceholder("Select an option")
		.addOptions([
			{
				label: "Option 1",
				value: "option1",
			},
			{
				label: "Option 2",
				value: "option2",
			},
			{
				label: "Option 3",
				value: "option3",
			},
		]),
	
	execute: async (interaction) => {								// REQUIRED, what should the select menu do?
		await interaction.reply("Select Menu Clicked!");
	},
} satisfies SelectMenu;