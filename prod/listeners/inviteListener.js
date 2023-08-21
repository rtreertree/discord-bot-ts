"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = (client) => {
    // console.log("Add message reaction");
    client.on(discord_js_1.Events.GuildCreate, async (guild) => {
        console.log(`Joined a new server ${guild.name} (${guild.id})`);
    });
    client.on(discord_js_1.Events.GuildDelete, async (guild) => {
        console.log(`Left a server ${guild.name} (${guild.id}) sad ;(`);
    });
};
