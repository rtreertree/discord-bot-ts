"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listHomework = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
exports.listHomework = {
    name: "list",
    description: "See your all homework",
    options: [
        {
            name: "mode",
            description: "filter homeworks by a tag",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "All", value: "all" },
                { name: "Undone", value: "undone_homework" },
                { name: "Done", value: "done_homework" },
            ]
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const filterMode = interaction.options.get('mode', true).value;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.listHomeworks(connection, interaction.user.id, filterMode);
        console.log(filterMode);
    }
};
