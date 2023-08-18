"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
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
            .setTitle("Settings")
            .setDescription("Select the setting you want to change")
            .setColor("#00874d")
            .setThumbnail(userpfp);
        const settingsSelect = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId("settingsselect")
            .setPlaceholder("Select a setting")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel("Send DM Notification")
            .setValue("send_dm_notification"), new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel("Placeholder")
            .setValue("placeholder"));
        const buttonOn = new discord_js_1.ButtonBuilder()
            .setCustomId("on")
            .setLabel("Enable")
            .setStyle(discord_js_1.ButtonStyle.Success);
        const buttonOff = new discord_js_1.ButtonBuilder()
            .setCustomId("off")
            .setLabel("Disable")
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const buttonCancel = new discord_js_1.ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(discord_js_1.ButtonStyle.Secondary);
        const selectrow = new discord_js_1.ActionRowBuilder()
            .addComponents(settingsSelect);
        const buttonrow = new discord_js_1.ActionRowBuilder()
            .addComponents(buttonCancel, buttonOn, buttonOff);
        const response = await interaction.deferReply({
            ephemeral: true,
        });
        await interaction.editReply({
            embeds: [settingsEmbed],
            components: [selectrow],
        });
        const collectorFilter = (i) => i.user.id === interaction.user.id;
        /*
            {
                "dmnotification": "true",
                "placeholder": "placeholder"
            }
        */
        try {
            const selectCollection = await response.awaitMessageComponent({ filter: collectorFilter, time: 120000 });
            if (selectCollection.values[0] === "send_dm_notification") {
                const send_dm_notification_embed = new discord_js_1.EmbedBuilder()
                    .setTitle("Send DM Notification")
                    .setDescription("Eneble/Disable Bot to send you DM notification")
                    .setColor("#00874d")
                    .setThumbnail(userpfp);
                selectCollection.reply({
                    content: "**Bot is thinking ...**",
                    emmephral: true
                });
                selectCollection.deleteReply();
                await interaction.editReply({
                    embeds: [send_dm_notification_embed],
                    components: [buttonrow]
                });
                const buttonCollection = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                const handler = new sqlhandler_1.sqlHandler();
                const connection = await handler.createConnection();
                if (buttonCollection.customId === "cancel") {
                    interaction.editReply({
                        content: "Cancelled",
                        components: [],
                        embeds: []
                    });
                }
                else if (buttonCollection.customId === "on") {
                    handler.setUsersettings(connection, interaction.user.id, true);
                    interaction.editReply({
                        content: "Send DM Notification **Enabled**",
                        components: [],
                        embeds: []
                    });
                }
                else if (buttonCollection.customId === "off") {
                    handler.setUsersettings(connection, interaction.user.id, false);
                    interaction.editReply({
                        content: "Send DM Notification **Disabled**",
                        components: [],
                        embeds: []
                    });
                }
                connection.end();
            }
            else if (selectCollection.values[0] === "placeholder") {
                interaction.editReply({
                    content: "Lol idiot why click placeholder"
                });
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
