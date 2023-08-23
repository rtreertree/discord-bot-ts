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
        const homeworkChannel = interaction.options.get("homeworkchannel", true).value;
        const logChannel = interaction.options.get("logchannel", true).value;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.newServerInit(connection, `${interaction.guildId}`, `${homeworkChannel}`, `${logChannel}`);
        connection.end();
    }
};
