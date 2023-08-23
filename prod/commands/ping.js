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
        const role = interaction.guild?.roles.cache.find(role => role.name == 'admin');
        const p = await interaction.guild?.members.fetch(interaction.user.id).then((user) => user?.roles.cache.get(role.id));
        console.log(p);
        // if (interaction.user == "Owner") {
        //     return interaction.reply("You can use this command!")
        // }
        // if (interaction.user. != "Owner") {
        //     return interaction.reply("Sorry, an error occurred.")
        // }
        // const member = interaction.options.getMember('target');
        // if (member?.roles.cache.some(role => role.name === 'role name')) {
        // 
        // }sda
    }
};
