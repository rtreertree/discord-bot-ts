"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHomework = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
const utils_1 = require("../../utils");
exports.addHomework = {
    name: "addhw",
    description: "Add a homework",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (!await (0, utils_1.filterUser)(interaction)) {
            return;
        }
        const add_hw_modal = new discord_js_1.ModalBuilder().setCustomId("add_hw_modal").setTitle("Add new homework");
        const subjectInput = new discord_js_1.TextInputBuilder()
            .setCustomId("subject_input")
            .setLabel("Subject")
            .setPlaceholder("Enter a subject")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const nameInput = new discord_js_1.TextInputBuilder()
            .setCustomId("name_input")
            .setLabel("Name")
            .setPlaceholder("Enter a name of assignment")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const desInput = new discord_js_1.TextInputBuilder()
            .setCustomId("des_input")
            .setLabel("Description")
            .setPlaceholder("Enter a Description")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const pageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("page_input")
            .setLabel("Page")
            .setPlaceholder("Enter a page")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const dueInput = new discord_js_1.TextInputBuilder()
            .setCustomId("due_input")
            .setLabel("Due date")
            .setPlaceholder("DD-MM-YYYY")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const ActionRow1 = new discord_js_1.ActionRowBuilder().addComponents(subjectInput);
        const ActionRow2 = new discord_js_1.ActionRowBuilder().addComponents(nameInput);
        const ActionRow3 = new discord_js_1.ActionRowBuilder().addComponents(desInput);
        const ActionRow4 = new discord_js_1.ActionRowBuilder().addComponents(pageInput);
        const ActionRow5 = new discord_js_1.ActionRowBuilder().addComponents(dueInput);
        add_hw_modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5);
        await interaction.showModal(add_hw_modal);
        const submitted = await interaction.awaitModalSubmit({
            time: 120000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error);
            return;
        });
        if (submitted) {
            let [subject_input, name_input, description_input, page_input, due_input] = await Promise.all([
                submitted.fields.getTextInputValue("subject_input"),
                submitted.fields.getTextInputValue("name_input"),
                submitted.fields.getTextInputValue("des_input"),
                submitted.fields.getTextInputValue("page_input"),
                submitted.fields.getTextInputValue("due_input"),
            ]);
            const year = Number(due_input.split('/').join(',').split('-').join(',').split(',')[2]);
            if (year > new Date().getFullYear()) {
                submitted.reply({
                    content: `Invalid date`,
                    ephemeral: true,
                });
                return;
            }
            submitted.reply({
                content: `Added to assignment`,
            });
            const confirm_embed = new discord_js_1.EmbedBuilder()
                .setColor("Green")
                .setTitle(`${subject_input} : ${name_input}`)
                .setDescription(`${description_input}`)
                .addFields({ name: "Page", value: `${page_input}` }, { name: "Due", value: `${due_input.split('/').join(',').split('-').join(',').split(',').join('/')}`, inline: true })
                .setTimestamp();
            let homework = {
                name: subject_input,
                subject: name_input,
                description: description_input,
                page: page_input,
                due_date: due_input
            };
            const handler = new sqlhandler_1.sqlHandler();
            const connection = await handler.createConnection();
            const res = await handler.addHomework(connection, homework);
            confirm_embed.setFooter({ text: `ID: ${res.homework_id}` });
            const response = await interaction.channel?.send({
                embeds: [confirm_embed],
            });
            await handler.updateHomeworkMessage(connection, response.id, res.homework_uuid);
            connection.end();
        }
    }
};
