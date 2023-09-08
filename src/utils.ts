import { Client, CommandInteraction, Guild, Message, MessagePayload, TextBasedChannel, TextChannel } from "discord.js";
import { sqlHandler } from "./sqlhandler";

export async function filterUser(interaction: CommandInteraction) {
    const role:any = interaction.guild?.roles.cache.find(role => role.name == 'admin')
    const p = await interaction.guild?.members.fetch(interaction.user.id).then((user) => user?.roles.cache.get(role.id));
    if (!p) {
        interaction.reply({
            content: "You have not permission to use this command",
            ephemeral: true,
        });
    }
    return p? true : false
}

export async function sendToUsers(client: Client, userid: string, message: MessagePayload) {
    const handler = new sqlHandler();
    const connection = await handler.createConnection();
    const user = await client.users.fetch("id");
    user.send(message);
    connection.end()
}


export async function logMessage(guild: Guild, content: string) {
    const handler = new sqlHandler();
    const connection = await handler.createConnection();

    const logID = await handler.getChannelId(connection, guild.id as string, "logCh");
    if (logID == "error") {
        console.log(`[LOG_ERROR] ${guild.name} does not have a log channel`);
        console.log(`[LOG_ERROR] ${content}`);
        return;
    }
    const logChannel: TextChannel = guild.channels.cache.get(logID as string) as TextChannel;
    try {
        logChannel?.send(content);
    } catch (error) {
        console.log(error);
    }
    connection.end();
}
