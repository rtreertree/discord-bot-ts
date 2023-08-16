import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AnyComponentBuilder, InteractionCollector, Message, MessagePayload } from "discord.js";
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
            .setTitle("Settings")
            .setDescription("Select the setting you want to change")
            .setColor("#00874d")
            .setThumbnail(userpfp);

        const settingsSelect = new StringSelectMenuBuilder()
            .setCustomId("settingsselect")
            .setPlaceholder("Select a setting")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Send DM Notification")
                    .setValue("send_dm_notification"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Placeholder")
                    .setValue("placeholder"),
            )

        const buttonOn = new ButtonBuilder()
            .setCustomId("on")
            .setLabel("Enable")
            .setStyle(ButtonStyle.Success);

        const buttonOff = new ButtonBuilder()
            .setCustomId("off")
            .setLabel("Disable")
            .setStyle(ButtonStyle.Danger);

        const buttonCancel = new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary);

        const selectrow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(settingsSelect);

        const buttonrow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(buttonCancel, buttonOn, buttonOff);

        const response = await interaction.deferReply({
            ephemeral: true,
        });

        await interaction.editReply({
            embeds: [settingsEmbed],
            components: [selectrow],
        });

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;
        /*
            {
                "dmnotification": "true",
                "placeholder": "placeholder"
            }
        */
        try {
            const selectCollection: any = await response.awaitMessageComponent({ filter: collectorFilter, time: 120000 });
            if (selectCollection.values[0] === "send_dm_notification") {
                const send_dm_notification_embed = new EmbedBuilder()
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

                const buttonCollection: any = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

                const handler = new sqlHandler();
                const connection = await handler.createConnection();

                if (buttonCollection.customId === "cancel") {
                    await interaction.editReply({
                        content: "Cancelled",
                        components: [],
                        embeds: []
                    });
                } else if (buttonCollection.customId === "on") {
                    await handler.setUsersettings(connection, interaction.user.id, true);
                    await interaction.editReply({
                        content: "Send DM Notification **Enabled**",
                        components: [],
                        embeds: []
                    });
                } else if (buttonCollection.customId === "off") {
                    await handler.setUsersettings(connection, interaction.user.id, false);
                    await interaction.editReply({
                        content: "Send DM Notification **Disabled**",
                        components: [],
                        embeds: []
                    });
                }
                connection.end();

            } else if (selectCollection.values[0] === "placeholder") {
                await interaction.editReply({
                    content: "Lol idiot why click placeholder"
                });
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