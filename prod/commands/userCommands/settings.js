"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
exports.settings = {
    name: "settings",
    description: "View/Change your settings",
    options: [
        {
            name: "send_notification",
            description: "toggle bot to send DM notification",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Enable', value: 'yes' },
                { name: 'Disable', value: 'no' },
            ]
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const sendNotification = interaction.options.get('send_notification');
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        handler.setUsersettings(connection, interaction.user.id, true);
        console.log(sendNotification);
        return;
    }
};
