import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	PermissionFlagsBits,
} from "discord.js";

import type { ContextMenuCommand } from "../types/ContextMenuCommand";

export default {
	permission: async () => true,																// OPTIONAL, defaults to true, allows custom permission checks

	data: new ContextMenuCommandBuilder()														// REQUIRED, name is inferred from file name, can be overriden with .setName()
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

	execute: async (interaction) => {															// REQUIRED, what should the command do?
		await interaction.reply("Pong!");
	},
} satisfies ContextMenuCommand;