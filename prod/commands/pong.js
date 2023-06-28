"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pong = void 0;
const discord_js_1 = require("discord.js");
exports.pong = {
    name: "pong",
    description: "run pong command",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const username = interaction.user.username;
        await interaction.reply({
            ephemeral: true,
            content: `Ping ${username}`
        });
    }
};
