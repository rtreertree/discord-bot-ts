"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMessage = exports.sendToUsers = exports.filterUser = void 0;
const sqlhandler_1 = require("./sqlhandler");
async function filterUser(interaction) {
    const role = interaction.guild?.roles.cache.find(role => role.name == 'admin');
    const p = await interaction.guild?.members.fetch(interaction.user.id).then((user) => user?.roles.cache.get(role.id));
    if (!p) {
        interaction.reply({
            content: "You have not permission to use this command",
            ephemeral: true,
        });
    }
    return p ? true : false;
}
exports.filterUser = filterUser;
async function sendToUsers(client, userid, message) {
    const handler = new sqlhandler_1.sqlHandler();
    const connection = await handler.createConnection();
    const user = await client.users.fetch("id");
    user.send(message);
    connection.end();
}
exports.sendToUsers = sendToUsers;
async function logMessage(guild, content) {
    const handler = new sqlhandler_1.sqlHandler();
    const connection = await handler.createConnection();
    const logID = await handler.getChannelId(connection, guild.id, "logCh");
    if (logID == "error") {
        console.log(`[LOG_ERROR] ${guild.name} does not have a log channel`);
        console.log(`[LOG_ERROR] ${content}`);
        return;
    }
    const logChannel = guild.channels.cache.get(logID);
    try {
        logChannel?.send(content);
    }
    catch (error) {
        console.log(error);
    }
    connection.end();
}
exports.logMessage = logMessage;
