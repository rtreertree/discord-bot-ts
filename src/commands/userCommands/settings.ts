import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder , StringSelectMenuOptionBuilder , ButtonBuilder , ButtonStyle , EmbedBuilder, AnyComponentBuilder, InteractionCollector } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const settings: Command = {
    name: "settings",
    description: "Change your settings",
    // options: [
    //     {
    //         name: "send_notification",
    //         description: "toggle bot to send DM notification",
    //         type: ApplicationCommandOptionType.String,
    //         required: true,
    //         choices: [
    //             { name: 'Enable', value: 'yes' },
    //             { name: 'Disable', value: 'no'},
    //         ]
    //     }
    // ],
    type: ApplicationCommandType.ChatInput,

    run: async (client: Client, interaction: CommandInteraction) => {
        // const sendNotification = interaction.options.get('send_notification');
        // await interaction.deferReply();

        const userpfp = interaction.user.displayAvatarURL();
        const settingsEmbed = new EmbedBuilder()
            .setTitle('Settings')
            .setDescription('Select the setting you want to change')
            .setColor('#00874d')
            .setThumbnail(userpfp);

        const settingsSelect = new StringSelectMenuBuilder()
            .setCustomId('settingsselect')
            .setPlaceholder('Select a setting')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Send DM Notification')
                    .setValue('send_dm_notification'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Placeholder')
                    .setValue('placeholder'),
            )

        const buttonOn = new ButtonBuilder()
            .setCustomId('on')
            .setLabel('Enable')
            .setStyle(ButtonStyle.Success);

        const buttonOff = new ButtonBuilder()
            .setCustomId('off')
            .setLabel('Disable')
            .setStyle(ButtonStyle.Danger);
        
        const actionrow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(settingsSelect);

        const actionrow2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(buttonOn, buttonOff);

        const response = await interaction.reply({
            embeds: [settingsEmbed],
            components: [actionrow, actionrow2],
            ephemeral: true,
        });

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;
        
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
            console.log(confirmation);
            if (confirmation.customId === 'settingsselect') {
                const selected = confirmation.valueOf();
                console.log(selected);
            } else if (confirmation.customId === 'cancel') {
            
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }

        // const handler = new sqlHandler();
        // const connection = await handler.createConnection();
        // const isChange = await handler.setUsersettings(connection, interaction.user.id, true);

        // if (isChange) {
        //     interaction.editReply({
        //         content: `Setting updated successfully`
        //     });
        // } else {
        //     interaction.editReply({
        //         content: `Setting not updated`
        //     });
        // }

        // connection.end();
        return;
    }
}