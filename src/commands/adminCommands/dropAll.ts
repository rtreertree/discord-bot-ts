import { CommandInteraction, Client, ApplicationCommandType} from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"
import { filterUser } from "../../utils";

export const dropall: Command = {
    name: "dropall",
    description: "Clear all database",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction : CommandInteraction) => {
        if (!await filterUser(interaction)){
            return;
        }

        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        const handler = new sqlHandler();
        const connection = await handler.createConnection();
        await handler.ThisFunctinForClearTheDatabase(connection);

        interaction.editReply({
            content: `DROP BOOOM NIGGA! Client ping: ${ping} ms`
        });
    }
};