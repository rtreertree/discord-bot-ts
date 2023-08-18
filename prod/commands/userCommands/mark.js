"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mark = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
exports.mark = {
    name: "mark",
    description: "get homework info by id",
    options: [
        {
            name: "id",
            description: "homework id",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "status",
            description: "homework status (done or undone)",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Done", value: "done" },
                { name: "Undone", value: "undone" },
            ]
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const homeworkID = interaction.options.get('id', true).value;
        const status = interaction.options.get('status', true).value;
        const isDone = status == "done" ? true : false;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.markHomework(connection, interaction.user.id, homeworkID, isDone);
        if (res) {
            interaction.reply({
                content: "Homework marked as " + status + "!",
                ephemeral: true
            });
        }
        else {
            interaction.reply({
                content: "Homework does not exist",
                ephemeral: true
            });
        }
    }
};
