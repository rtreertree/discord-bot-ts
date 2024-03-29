"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomework = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.deleteHomework = {
    name: "removehw",
    description: "delete a homework by id",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "id",
            description: "homework id",
            type: discord_js_1.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if (!await (0, utils_1.filterUser)(interaction)) {
            return;
        }
        const homeworkID = interaction.options.get("id", true).value;
        await interaction.deferReply();
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const result = await handler.deleteHomework(connection, homeworkID);
        connection.end();
        if (result) {
            interaction.editReply({
                content: `Deleted homework id = ${homeworkID} by ${interaction.user}}`
            });
        }
        else {
            interaction.editReply({
                content: `Homework selected by id = ${homeworkID} was not found!!`
            });
        }
    }
};
