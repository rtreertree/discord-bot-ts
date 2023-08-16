import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const getInfo: Command = {
    name: "info",
    description: "get homework info by id",
    options: [
        {
            name: "id",
            description: "homework id",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const homeworkID: any = interaction.options.get('id', true).value;
        const handler = new sqlHandler();
        const connection = await handler.createConnection();
        await interaction.deferReply({ephemeral: true});
        const res = await handler.getHomeworkById(connection, homeworkID);

        if (res.due_date == "400") {
            interaction.editReply({
                content: `Homework not found`
            });
            return;
        }

        const display = new EmbedBuilder()
            .setColor('#00874d')
            .setTitle(res.name)
            .setDescription(res.description)
            .addFields(
                { name: 'Subject', value: res.subject, inline: true },
                { name: 'Page', value: res.page, inline: true},
                { name: 'Due Date', value: res.due_date },
            )
            .setFooter({text: `Homework ID: ${homeworkID}`});

        interaction.editReply({
            embeds: [display],
        });
        connection.end();
    }
}