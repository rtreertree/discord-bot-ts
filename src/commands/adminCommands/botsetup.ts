import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, Guild, ChannelType, TextBasedChannel } from "discord.js";
import { sqlHandler } from "../../sqlhandler"
import { Command } from "../../Command"
import { filterUser, logMessage } from "../../utils";

export const botsetup: Command = {
    name: "botsetup",
    description: "Add a homework",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    defaultMemberPermissions: (PermissionFlagsBits.Administrator),
    options: [
        {
            name: "homeworkchannel",
            description: "The channel to send new homework alert to",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "logchannel",
            description: "The channel to log bot activities to",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        if (!await filterUser(interaction)){
            return;
        }


        const homeworkChannelid = interaction.options.get("homeworkchannel", true).value;
        const logChannelid = interaction.options.get("logchannel", true).value;

        const homeworkChannel = interaction.guild?.channels.cache.find(ch => ch.id == homeworkChannelid);
        const logChannel = interaction.guild?.channels.cache.find(ch => ch.id == logChannelid);

        const filter = (homeworkChannel?.type == 0 || homeworkChannel?.type == 10) && (logChannel?.type == 0 || logChannel?.type == 10)
        if (!filter) {
            interaction.reply({
                content: "channel is not a text channel",
                ephemeral: true
            });
            return;
        }

        const handler = new sqlHandler();
        const connection = await handler.createConnection();

        const res = await handler.newServerInit(connection, `${interaction.guildId}`,`${homeworkChannel}`, `${logChannel}`);
        connection.end();


        if (res) {
            interaction.reply({
                content: "Bot setup success",
                ephemeral: true
            });
            logMessage(interaction.guild as Guild, `**[BOT_SETUP]** ${interaction.user} Has setup the bot for this server\n> Homework channel: ${homeworkChannel}\n> Log channel: ${logChannel}`);
        } else {
            interaction.reply({
                content: "Server infomation updated",
                ephemeral: true
            });
            logMessage(interaction.guild as Guild, `**[BOT_SETUP]** ${interaction.user} Has updated the bot's server settings\n> Homework channel: ${homeworkChannel}\n> Log channel: ${logChannel}`);

        }
    }
};