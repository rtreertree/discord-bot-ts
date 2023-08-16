import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const mark: Command = {
    name: "mark",
    description: "get homework info by id",
    options: [
        {
            name: "id",
            description: "homework id",
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "status",
            description: "homework status (done or undone)",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Done", value: "done" },
                { name: "Undone", value: "undone" },
            ]
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const homeworkID: any = interaction.options.get('id', true).value;
        const status: any = interaction.options.get('status', true).value;

        const handler = new sqlHandler();
        const connection = await handler.createConnection();

        handler.markHomework(connection,interaction.user.id, homeworkID, true);
    }
}