"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botsetup = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.botsetup = {
    name: "botsetup",
    description: "Add a homework",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    dmPermission: false,
    defaultMemberPermissions: (discord_js_1.PermissionFlagsBits.Administrator),
    options: [
        {
            name: "homeworkchannel",
            description: "The channel to send new homework alert to",
            type: discord_js_1.ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "logchannel",
            description: "The channel to log bot activities to",
            type: discord_js_1.ApplicationCommandOptionType.Channel,
            required: true
        },
    ],
    run: async (client, interaction) => {
        if (!await (0, utils_1.filterUser)(interaction)) {
            return;
        }
        const homeworkChannelid = interaction.options.get("homeworkchannel", true).value;
        const logChannelid = interaction.options.get("logchannel", true).value;
        const homeworkChannel = interaction.guild?.channels.cache.find(ch => ch.id == homeworkChannelid);
        const logChannel = interaction.guild?.channels.cache.find(ch => ch.id == logChannelid);
        const filter = (homeworkChannel?.type == 0 || homeworkChannel?.type == 10) && (logChannel?.type == 0 || logChannel?.type == 10);
        if (!filter) {
            interaction.reply({
                content: "channel is not a text channel",
                ephemeral: true
            });
            return;
        }
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.newServerInit(connection, `${interaction.guildId}`, `${homeworkChannel}`, `${logChannel}`);
        connection.end();
        if (res) {
            interaction.reply({
                content: "Bot setup success",
                ephemeral: true
            });
            (0, utils_1.logMessage)(interaction.guild, `**[BOT_SETUP]** ${interaction.user} Has setup the bot for this server\n> Homework channel: ${homeworkChannel}\n> Log channel: ${logChannel}`);
        }
        else {
            interaction.reply({
                content: "Server infomation updated",
                ephemeral: true
            });
            (0, utils_1.logMessage)(interaction.guild, `**[BOT_SETUP]** ${interaction.user} Has updated the bot's server settings\n> Homework channel: ${homeworkChannel}\n> Log channel: ${logChannel}`);
        }
    }
};
