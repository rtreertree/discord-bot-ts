import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const getInfo: Command = {
    name: "info",
    description: "get homework info by id",
    options: [
        {
            name: "id",
            description: "homework id",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const homeworkID: any = interaction.options.get('id', true).value;
        const handler = new sqlHandler();
        const connection = await handler.createConnection();
        await interaction.deferReply();
        const res = await handler.getHomeworkById(connection, homeworkID);

        if (res.due_date == "400") {
            interaction.editReply({
                content: `Homework not found`
            });
        }else {
            interaction.editReply({
                content: `${interaction.user.displayAvatarURL()}`
            });
        }
        console.log(res);
    }
}