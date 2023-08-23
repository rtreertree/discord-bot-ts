"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.register = {
    name: "register",
    description: "Register this user",
    options: [
        {
            name: "user",
            description: "User to regeister",
            type: discord_js_1.ApplicationCommandOptionType.User,
            required: false
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    // setdefaultpermission: ,
    run: async (client, interaction) => {
        if (!await (0, utils_1.filterUser)(interaction)) {
            return;
        }
        const user = interaction.options.getUser("user", false);
        if (user !== null) {
            if (user.bot) {
                interaction.reply({
                    content: `Cannot register bots`,
                    ephemeral: true
                });
                return;
            }
        }
        if (interaction.user.bot) {
            interaction.reply({
                content: `Bots cannot use this command`,
                ephemeral: true
            });
            return;
        }
        let username;
        let userid;
        if (user) {
            username = user.username;
            userid = user.id;
        }
        else {
            username = interaction.user.username;
            userid = interaction.user.id;
        }
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.registerUser(connection, username, userid);
        connection.end();
        if (res) {
            interaction.reply({
                content: `Registered <@${userid}>`,
                ephemeral: true
            });
            console.log(`[INFO] command: register ${userid}, ${username}`);
        }
        else {
            interaction.reply({
                content: `User <@${userid}> maybe already be registered`,
                ephemeral: true
            });
            console.log(`[INFO] command: register failed to register user id: ${userid}`);
        }
    }
};
