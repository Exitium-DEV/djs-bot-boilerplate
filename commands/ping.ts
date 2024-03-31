import {
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";

import type { Command } from "../types/Command";

export default {
	permission: async (interaction) => {														// OPTIONAL, defaults to true, allows custom permission checks
		// do something then return whether the member has permission to run the command
		return true;
	},												

	data: new SlashCommandBuilder()																// REQUIRED, name is inferred from file name
		.setDescription("Replies with Pong!")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),							// OPTIONAL, who can see the command?

	execute: async (interaction) => {															// REQUIRED, what should the command do?
		await interaction.reply("Pong!");
	},
} satisfies Command;																			// OPTIONAL, used for type checking, shows errors if the object is not the right format