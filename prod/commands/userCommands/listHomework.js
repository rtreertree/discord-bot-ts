"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listHomework = void 0;
const discord_js_1 = require("discord.js");
const sqlhandler_1 = require("../../sqlhandler");
exports.listHomework = {
    name: "list",
    description: "See your all homework",
    options: [
        {
            name: "mode",
            description: "filter homeworks by a tag",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Both", value: "both" },
                { name: "Done", value: "done" },
                { name: "Undone", value: "undone" },
            ]
        }
    ],
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const filterMode = interaction.options.get("mode", true).value;
        const handler = new sqlhandler_1.sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.listHomeworks(connection, interaction.user.id, filterMode);
        console.log(res);
        connection.end();
        const reply = await interaction.deferReply({
            ephemeral: false
        });
        const listDone_embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}'s List`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("#30d002") // Green
            .setTitle("Completed Homeworks")
            .setTimestamp();
        const listUndone_embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}'s List`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("#e80001") // Red
            .setTitle("Incomplete Homeworks")
            .setTimestamp();
        let countDone = 0;
        let countUndone = 0;
        res.forEach((info) => {
            if (info.isDone) {
                listDone_embed.addFields({ name: `${info.subject} : ${info.name} | [ID:${info.homework_id}]`, value: `Page ${info.page} | Due on ${info.due_date}`, inline: false });
                countDone++;
            }
            else {
                listUndone_embed.addFields({ name: `${info.subject} : ${info.name} | [ID:${info.homework_id}]`, value: `Page ${info.page} | Due on ${info.due_date}`, inline: false });
                countUndone++;
            }
        });
        if (countDone === 0) {
            listDone_embed.setDescription("`You have no completed homeworks`");
        }
        if (countUndone === 0) {
            listUndone_embed.setDescription("`You have no incomplete homeworks`");
        }
        if (filterMode === "both") {
            await interaction.editReply({
                embeds: [listDone_embed, listUndone_embed]
            });
        }
        else if (filterMode === "done") {
            await interaction.editReply({
                embeds: [listDone_embed]
            });
        }
        else if (filterMode === "undone") {
            await interaction.editReply({
                embeds: [listUndone_embed]
            });
        }
        return;
    }
};
/*

[
  {
    homework_id: 1,
    name: 'English',
    description: '44',
    due_date: '27/06/2023',
    page: '44',
    subject: 'Jhin',
    isDone: true
  },
  {
    homework_id: 2,
    name: 'AAA',
    description: 'I done this fcuk home',
    due_date: '20/06/2024',
    page: '2',
    subject: 'BBB',
    isDone: false
  },
  {
    homework_id: 3,
    name: 'hi',
    description: 'heeelloo',
    due_date: '11/08/2023',
    page: '1234567489',
    subject: 'hello',
    isDone: false
  }
]

*/ 
