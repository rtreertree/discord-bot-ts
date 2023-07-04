"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const discord_js_1 = require("discord.js");
exports.ping = {
    name: "ping",
    description: "run pong command",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        interaction.editReply({
            content: `Pong! Client ping: ${ping} ms`
        });
    }
};
