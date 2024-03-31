import type { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";
import type { InteractionClientOverride } from "./InteractionClientOverride";

export interface ContextMenuCommand {
    permission?: (interaction: InteractionClientOverride<ContextMenuCommandInteraction>) => Promise<boolean>;
    data: ContextMenuCommandBuilder;
    execute: (interaction: InteractionClientOverride<ContextMenuCommandInteraction>) => Promise<any>;
}
