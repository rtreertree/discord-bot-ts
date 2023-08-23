"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropall = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.dropall = {
    name: "dropall",
    description: "Clear all database",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (!await (0, utils_1.filterUser)(interaction)) {
            return;
        }
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        await handler.ThisFunctinForClearTheDatabase(connection);
        interaction.editReply({
            content: `DROP BOOOM NIGGA! Client ping: ${ping} ms`
        });
    }
};
