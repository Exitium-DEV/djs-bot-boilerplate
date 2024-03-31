import type { ModalBuilder, ModalSubmitInteraction } from "discord.js";
import type { InteractionClientOverride } from "./InteractionClientOverride";

export interface Modal {
    data: ModalBuilder;
    execute: (interaction: InteractionClientOverride<ModalSubmitInteraction>) => Promise<any>;
}
