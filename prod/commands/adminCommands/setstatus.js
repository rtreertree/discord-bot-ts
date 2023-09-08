"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setstatus = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.setstatus = {
    name: "setstatus",
    description: "Set a homework status for specified user",
    options: [
        {
            name: "hwid",
            description: "Homework ID",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "status",
            description: "Homework status",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Done", value: "done" },
                { name: "Undone", value: "undone" }
            ]
        },
        {
            name: "user",
            description: "User to set homework status",
            type: discord_js_1.ApplicationCommandOptionType.User,
            required: true
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (!await (0, utils_1.filterUser)(interaction)) {
            return;
        }
        const homeworkID = interaction.options.get("hwid", true).value;
        const status = interaction.options.get("status", true).value;
        const userid = interaction.options.get("user", true).value;
        const usermention = "<@" + userid + ">";
        const isDone = status === "done" ? true : false;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.markHomework(connection, interaction.user.id, homeworkID, isDone);
        if (res) {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* marked as **${status}** for ${usermention}!`,
                ephemeral: true
            });
            (0, utils_1.logMessage)(interaction.guild, `**[HW_STATUS]** ${interaction.user} changed ${usermention}'s homework status:\n> ID: **${homeworkID}**\n> Status: **${status}**`);
        }
        else {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* does not exist`,
                ephemeral: true
            });
        }
    }
};
