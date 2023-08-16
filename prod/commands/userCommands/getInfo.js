"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
exports.getInfo = {
    name: "info",
    description: "get homework info by id",
    options: [
        {
            name: "id",
            description: "homework id",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const homeworkID = interaction.options.get('id', true).value;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        await interaction.deferReply({ ephemeral: true });
        const res = await handler.getHomeworkById(connection, homeworkID);
        if (res.due_date == "400") {
            interaction.editReply({
                content: `Homework not found`
            });
            return;
        }
        const display = new discord_js_1.EmbedBuilder()
            .setColor('#00874d')
            .setTitle(res.name)
            .setDescription(res.description)
            .addFields({ name: 'Subject', value: res.subject, inline: true }, { name: 'Page', value: res.page, inline: true }, { name: 'Due Date', value: res.due_date })
            .setFooter({ text: `Homework ID: ${homeworkID}` });
        interaction.editReply({
            embeds: [display],
        });
        connection.end();
    }
};
