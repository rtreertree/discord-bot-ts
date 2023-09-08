import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, Guild } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"
import { logMessage } from "../../utils"

export const undodone: Command = {
    name: "undodone",
    description: "Set a homework status to Undone",
    options: [
        {
            name: "id",
            description: "Homework ID",
            type: ApplicationCommandOptionType.Number,
            required: true
        },
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const homeworkID: any = interaction.options.get('id', true).value;

        const handler = new sqlHandler();
        const connection = await handler.createConnection();

        const res = await handler.markHomework(connection,interaction.user.id, homeworkID, false);
        if (res) {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* marked as **Undone!**`,
                ephemeral: true
            });
            logMessage(interaction.guild as Guild, `**[HW_STATUS]** ${interaction.user} changed own homework status:\n> ID: **${homeworkID}**\n> Status: **Undone**`);
        } else {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* does not exist`,
                ephemeral: true
            });
        }
    }
}