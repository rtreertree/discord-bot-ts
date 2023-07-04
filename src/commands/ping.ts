import { CommandInteraction, Client, ApplicationCommandType} from "discord.js";
import {Command} from "../Command"

export const ping: Command = {
    name: "ping",
    description: "run pong command",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction : CommandInteraction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        
        interaction.editReply({
            content: `Pong! Client ping: ${ping} ms`
        });
    }
};