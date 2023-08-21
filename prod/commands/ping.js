"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../sqlhandler");
exports.ping = {
    name: "ping",
    description: "run pong command",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.newServerInit(connection, interaction.guild);
        interaction.editReply({
            content: `Pong! Client ping: ${ping} ms`
        });
    }
};
