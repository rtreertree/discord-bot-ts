import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command"
import { sqlHandler } from "../sqlhandler";

export const ping: Command = {
    name: "ping",
    description: "run pong command",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply({
            content: `Pong! Client ping: ${ping} ms`
        });
        const role:any = interaction.guild?.roles.cache.find(role => role.name == 'admin')
        const p = await interaction.guild?.members.fetch(interaction.user.id).then((user) => user?.roles.cache.get(role.id));
        console.log(p);
        
    }
};