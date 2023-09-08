"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undodone = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.undodone = {
    name: "undodone",
    description: "Set a homework status to Undone",
    options: [
        {
            name: "id",
            description: "Homework ID",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true
        },
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const homeworkID = interaction.options.get('id', true).value;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.markHomework(connection, interaction.user.id, homeworkID, false);
        if (res) {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* marked as **Undone!**`,
                ephemeral: true
            });
            (0, utils_1.logMessage)(interaction.guild, `**[HW_STATUS]** ${interaction.user} changed own homework status:\n> ID: **${homeworkID}**\n> Status: **Undone**`);
        }
        else {
            interaction.reply({
                content: `Homework *ID: ${homeworkID}* does not exist`,
                ephemeral: true
            });
        }
    }
};
