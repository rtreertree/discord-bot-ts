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
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        handler.markHomework(connection, interaction.user.id, homeworkID, true);
    }
};
