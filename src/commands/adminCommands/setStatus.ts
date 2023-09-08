import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, Guild } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"
import { filterUser, logMessage } from "../../utils"

export const setstatus: Command = {
    name: "setstatus",
    description: "Set a homework status for specified user",
    options: [
        {
            name: "hwid",
            description: "Homework ID",
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "status",
            description: "Homework status",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Done", value: "done" },
                { name: "Undone", value: "undone" }
            ]
        },
        {
            name: "user",
            description: "User to set homework status",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        if (!await filterUser(interaction)){
            return;
        }

        const homeworkID: any = interaction.options.get("hwid", true).value;
        const status: any = interaction.options.get("status", true).value;
        const userid: any = interaction.options.get("user", true).value;
        const usermention = "<@" + userid + ">";
        const isDone = status === "done" ? true : false;

        

        const handler = new sqlHandler();
        const connection = await handler.createConnection();

        const res = await handler.markHomework(connection,interaction.user.id, homeworkID, isDone);
        if (res) {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* marked as **${status}** for ${usermention}!`,
                ephemeral: true
            });
            logMessage(interaction.guild as Guild, `**[HW_STATUS]** ${interaction.user} changed ${usermention}'s homework status:\n> ID: **${homeworkID}**\n> Status: **${status}**`);
        } else {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* does not exist`,
                ephemeral: true
            });
        }
    }
}