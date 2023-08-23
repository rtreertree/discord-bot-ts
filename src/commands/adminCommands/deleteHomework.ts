import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType} from "discord.js";
import { sqlHandler } from "../../sqlhandler"
import { Command } from "../../Command"
import { filterUser } from "../../utils";

export const deleteHomework: Command = {
    name: "removehw",
    description: "delete a homework by id",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "id",
            description: "homework id",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async (client: Client, interaction : CommandInteraction) => {
        if (!await filterUser(interaction)){
            return;
        }

        const homeworkID: any = interaction.options.get("id", true).value;
        await interaction.deferReply();
        
        const handler = new sqlHandler();
        const connection = await handler.createConnection();
        const result = await handler.deleteHomework(connection, homeworkID);
        connection.end();


        if (result){
            interaction.editReply({
                content: `Deleted homework id = ${homeworkID} by ${interaction.user}}`
            });
        }else {
            interaction.editReply({
                content: `Homework selected by id = ${homeworkID} was not found!!`
            });
        }

    }
};