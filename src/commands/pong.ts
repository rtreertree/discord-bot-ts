import { CommandInteraction, Client, ApplicationCommandType} from "discord.js";
import {Command} from "../Command"

export const pong: Command = {
    name: "pong",
    description: "run pong command",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction : CommandInteraction) => {
        const username: string = interaction.user.username;
        await interaction.reply({
            ephemeral: true,
            content: `Ping ${username}`
        });
    }
};