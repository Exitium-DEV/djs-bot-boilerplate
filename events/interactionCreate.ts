import { EmbedBuilder, type Interaction } from "discord.js";
import { Client } from "../utilities/Client";

export default {
	once: false,
	execute(interaction: Interaction) {
		if (interaction.isChatInputCommand()) {
			const client = interaction.client as Client;
			const { commandName } = interaction;

			const command = client.commandData.get(commandName);
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
	}
}