import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const settings: Command = {
    name: "settings",
    description: "View/Change your settings",
    options: [
        {
            name: "send_notification",
            description: "toggle bot to send DM notification",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Enable', value: 'yes' },
                { name: 'Disable', value: 'no'},
            ]
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const sendNotification = interaction.options.get('send_notification');
        await interaction.deferReply();

        const handler = new sqlHandler();
        const connection = await handler.createConnection();
        const isChange = await handler.setUsersettings(connection, interaction.user.id, true);
        if (isChange) {            
            interaction.editReply({
                content: `Setting updated successfully`
            });
        } else {
            interaction.editReply({
                content: `Setting not updated`
            });
        }
        connection.end();
        return;
    }
}