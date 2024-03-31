import {
	type Interaction,
	type AnySelectMenuInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ModalSubmitInteraction
} from "discord.js";

import { type Event } from "../../types/Event";
import type { InteractionClientOverride } from "../../types/InteractionClientOverride";

function handleChatInputCommand(interaction: InteractionClientOverride<ChatInputCommandInteraction>) {
	const { commandName, client } = interaction;

	const command = client.commands.get(commandName);
	if (!command) return;

	client.sentry?.addBreadcrumb({
		category: "command",
		data: {
			data: command.data.toJSON(),
			interaction: interaction.toJSON(),
		},
		type: "info"
	});

	const permission = command.permission ? command.permission(interaction) : true;
	if (!permission) return interaction.reply({ content: "You do not have permission to execute this command.", ephemeral: true });

	command.execute(interaction)
		.catch((error) => {
			const errorId = client.handleError(error);
			const errorEmbed = new EmbedBuilder()
				.setTitle("An error occurred")
				.setDescription('Something unexpected happened while executing this command.\nIf this issue persists, please report it to the developer.')
				.setColor(0xFF0000);
			
			client.sentry && errorEmbed.setFooter({text: `Error ID: ${errorId}`});

			if (interaction.replied) interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
			else interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		});
}

function handleButton(interaction: InteractionClientOverride<ButtonInteraction>) {
	const { customId, client } = interaction;

	const button = client.components.buttons.get(customId);
	if (!button) return;

	client.sentry?.addBreadcrumb({
		category: "button",
		data: {
			data: button.data.toJSON(),
			interaction: interaction.toJSON(),
		},
		type: "info"
	});

	button.execute(interaction)
		.catch((error) => {
			const errorId = client.handleError(error);
			const errorEmbed = new EmbedBuilder()
				.setTitle("An error occurred")
				.setDescription('Something unexpected happened while executing this button.\nIf this issue persists, please report it to the developer.')
				.setColor(0xFF0000);
			
			client.sentry && errorEmbed.setFooter({text: `Error ID: ${errorId}`});

			if (interaction.replied) interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
			else interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		});
}

function handleAnySelectMenu(interaction: InteractionClientOverride<AnySelectMenuInteraction>) {
	const { customId, client } = interaction;

	const selectMenu = client.components.selectMenus.get(customId);
	if (!selectMenu) return;

	client.sentry?.addBreadcrumb({
		category: "selectMenu",
		data: {
			data: selectMenu.data.toJSON(),
			interaction: interaction.toJSON(),
		},
		type: "info"
	});

	selectMenu.execute(interaction)
		.catch((error) => {
			const errorId = client.handleError(error);
			const errorEmbed = new EmbedBuilder()
				.setTitle("An error occurred")
				.setDescription('Something unexpected happened while executing this select menu.\nIf this issue persists, please report it to the developer.')
				.setColor(0xFF0000);
			
			client.sentry && errorEmbed.setFooter({text: `Error ID: ${errorId}`});

			if (interaction.replied) interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
			else interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		});
}

function handleModalSubmit(interaction: InteractionClientOverride<ModalSubmitInteraction>) {
	const { customId, client } = interaction;

	const modal = client.components.modals.get(customId);
	if (!modal) return;

	client.sentry?.addBreadcrumb({
		category: "modal",
		data: {
			data: modal.data.toJSON(),
			interaction: interaction.toJSON(),
		},
		type: "info"
	});

	modal.execute(interaction)
		.catch((error) => {
			const errorId = client.handleError(error);
			const errorEmbed = new EmbedBuilder()
				.setTitle("An error occurred")
				.setDescription('Something unexpected happened while executing this select menu.\nIf this issue persists, please report it to the developer.')
				.setColor(0xFF0000);
			
			client.sentry && errorEmbed.setFooter({text: `Error ID: ${errorId}`});

			if (interaction.replied) interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
			else interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		});
}

export default {
	execute(interaction: InteractionClientOverride<Interaction>) {
		if (interaction.isChatInputCommand()) return handleChatInputCommand(interaction);
		if (interaction.isButton()) return handleButton(interaction);
		if (interaction.isAnySelectMenu()) return handleAnySelectMenu(interaction);
		if (interaction.isModalSubmit()) return handleModalSubmit(interaction);
	}
} satisfies Event;