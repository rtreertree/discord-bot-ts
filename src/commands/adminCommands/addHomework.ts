import { CommandInteraction, ModalSubmitInteraction, EmbedBuilder, Client, ApplicationCommandType, TextInputBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle, Guild, TextBasedChannel, TextChannel} from "discord.js";
import { Command } from "../../Command"
import { sqlHandler, homeworkConfig, errorType } from "../../sqlhandler"
import { filterUser, logMessage } from "../../utils";
import moment from 'moment';

export const addHomework: Command = {
    name: "addhw",
    description: "Add a homework",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        if (!await filterUser(interaction)){
            return;
        }
        const add_hw_modal = new ModalBuilder().setCustomId("add_hw_modal").setTitle("Add new homework");
        const subjectInput = new TextInputBuilder()
            .setCustomId("subject_input")
            .setLabel("Subject")
            .setPlaceholder("Enter a subject")
            .setStyle(TextInputStyle.Short);

        const nameInput = new TextInputBuilder()
            .setCustomId("name_input")
            .setLabel("Name")
            .setPlaceholder("Enter a name of assignment")
            .setStyle(TextInputStyle.Short);

        const desInput = new TextInputBuilder()
            .setCustomId("des_input")
            .setLabel("Description")
            .setPlaceholder("Enter a Description")
            .setStyle(TextInputStyle.Short);

        const pageInput = new TextInputBuilder()
            .setCustomId("page_input")
            .setLabel("Page")
            .setPlaceholder("Enter a page")
            .setStyle(TextInputStyle.Short);

        const dueInput = new TextInputBuilder()
            .setCustomId("due_input")
            .setLabel("Due date")
            .setPlaceholder("DD-MM-YYYY")
            .setStyle(TextInputStyle.Short);


        const ActionRow1: any = new ActionRowBuilder().addComponents(subjectInput);
        const ActionRow2: any = new ActionRowBuilder().addComponents(nameInput);
        const ActionRow3: any = new ActionRowBuilder().addComponents(desInput);
        const ActionRow4: any = new ActionRowBuilder().addComponents(pageInput);
        const ActionRow5: any = new ActionRowBuilder().addComponents(dueInput);

        add_hw_modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5);
        await interaction.showModal(add_hw_modal)



        const submitted = await interaction.awaitModalSubmit({
            time: 120000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error)
            return;
        })

        if (submitted) {
            let [subject_input, name_input, description_input, page_input, due_input] = await Promise.all([
                submitted.fields.getTextInputValue("subject_input"),
                submitted.fields.getTextInputValue("name_input"),
                submitted.fields.getTextInputValue("des_input"),
                submitted.fields.getTextInputValue("page_input"),
                submitted.fields.getTextInputValue("due_input"),
            ]);
            
            // @ts-expect-error
            const dateFilter = moment(due_input, "DD-MM-YYYY");
            console.log(dateFilter.isValid());
            if (dateFilter.toString() == "Invalid Date") {
                submitted.reply({
                    content: `**[ERROR]** Invalid date please use DD-MM-YYYY format (Code:1)`,
                    ephemeral: true,
                });
                return;
            }

            const year = Number(due_input.split('/').join(',').split('-').join(',').split(',')[2]);
            if (year > new Date().getFullYear() + 2) {
                submitted.reply({
                    content: `**[ERROR]** Invalid date please use DD-MM-YYYY format (Code:2)`,
                    ephemeral: true,
                });
                return;
            }            

            submitted.reply({
                content: `Added to assignment`,
                ephemeral: true,
            });

            const confirm_embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle(`${subject_input} : ${name_input}`)
                .setDescription(`${description_input}`)
                .addFields(
                    { name: "Page", value: `${page_input}` },
                    { name: "Due", value: `${due_input.split('/').join(',').split('-').join(',').split(',').join('/')}`, inline: true }
                )
                .setTimestamp()
            
            let homework: homeworkConfig = {
                name: subject_input,
                subject: name_input,
                description: description_input,
                page: page_input,
                due_date: due_input
            };


            const handler = new sqlHandler();
            const connection = await handler.createConnection();
            const res: any = await handler.addHomework(connection, homework);
            
            confirm_embed.setFooter({ text: `ID: ${res.homework_id}` });
            const homeworkChannelid = await handler.getChannelId(connection, interaction.guildId as string, "hwCh");
            if (homeworkChannelid == "error") {
                console.log(`[ADDHOMEWORK_ERROR] can not get information from "${interaction.guild?.name}"`);
                return;
            }

            const homeworkChannel: TextChannel = interaction.guild?.channels.cache.get(homeworkChannelid as string) as TextChannel;
            if (!homeworkChannel) {
                console.log(`[ADDHOMEWORK_ERROR] can not get channel from "${interaction.guild?.name}"`);
                return;
            }

            // Send homework to channel
            const response: any = await homeworkChannel.send({
                embeds: [confirm_embed],
            });
            
            await handler.updateHomeworkMessage(connection, response.id, res.homework_uuid);
            connection.end();

            logMessage(interaction.guild as Guild, `**[ADD_HW]** ${interaction.user.username} added a new homework with\n> ID: ${res.homework_id}`);
        }
    }
};