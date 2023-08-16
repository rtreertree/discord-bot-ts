"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const discord_js_1 = require("discord.js");
exports.settings = {
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
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        // const sendNotification = interaction.options.get('send_notification');
        // await interaction.deferReply();
        const userpfp = interaction.user.displayAvatarURL();
        const settingsEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Settings')
            .setDescription('Select the setting you want to change')
            .setColor('#00874d')
            .setThumbnail(userpfp);
        const settingsSelect = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('settingsselect')
            .setPlaceholder('Select a setting')
            .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel('Send DM Notification')
            .setValue('send_dm_notification'), new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel('Placeholder')
            .setValue('placeholder'));
        const buttonOn = new discord_js_1.ButtonBuilder()
            .setCustomId('on')
            .setLabel('Enable')
            .setStyle(discord_js_1.ButtonStyle.Success);
        const buttonOff = new discord_js_1.ButtonBuilder()
            .setCustomId('off')
            .setLabel('Disable')
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const actionrow = new discord_js_1.ActionRowBuilder()
            .addComponents(settingsSelect);
        const actionrow2 = new discord_js_1.ActionRowBuilder()
            .addComponents(buttonOn, buttonOff);
        const response = await interaction.reply({
            embeds: [settingsEmbed],
            components: [actionrow, actionrow2],
            ephemeral: true,
        });
        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
            console.log(confirmation);
            if (confirmation.customId === 'settingsselect') {
                const selected = confirmation.valueOf();
                console.log(selected);
            }
            else if (confirmation.customId === 'cancel') {
            }
        }
        catch (e) {
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
};
