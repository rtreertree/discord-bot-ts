"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropall = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
exports.dropall = {
    name: "dropall",
    description: "Clear all database",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
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
