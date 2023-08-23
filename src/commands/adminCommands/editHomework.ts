import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder} from "discord.js";
import { homeworkConfig, sqlHandler } from "../../sqlhandler"
import { Command } from "../../Command"
import { filterUser } from "../../utils";


export const editHomework: Command = {
    name: "edithw",
    description: "edit a homework by id",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "id",
            description: "homework id",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async (client: Client, interaction : CommandInteraction) => {
        if (!await filterUser(interaction)){
            return;
        }

        const homeworkID: any = interaction.options.get("id", true).value;
        const handler = new sqlHandler();
        const connection = await handler.createConnection();
        const oldHomework = await handler.getHomeworkById(connection, homeworkID);
        await connection.end();

        if (oldHomework.due_date == "400") {
            interaction.reply({
                content: "Homework does not exist",
                ephemeral: true
            });
            return;
        }

        const add_hw_modal = new ModalBuilder().setCustomId("add_hw_modal").setTitle("Add new homework");
        const subjectInput = new TextInputBuilder()
        .setCustomId("subject_input")
        .setLabel("Subject")
        .setPlaceholder("Enter a subject")
        .setValue(oldHomework.subject)
        .setStyle(TextInputStyle.Short);

        const nameInput = new TextInputBuilder()
        .setCustomId("name_input")
        .setLabel("Name")
        .setPlaceholder("Enter a name of assignment")
        .setValue(oldHomework.name)
        .setStyle(TextInputStyle.Short);

        const desInput = new TextInputBuilder()
        .setCustomId("des_input")
        .setLabel("Description")
        .setPlaceholder("Enter a Description")
        .setValue(oldHomework.description)
        .setStyle(TextInputStyle.Short);

        const pageInput = new TextInputBuilder()
        .setCustomId("page_input")
        .setLabel("Page")
        .setPlaceholder("Enter a page")
        .setValue(oldHomework.page)
        .setStyle(TextInputStyle.Short);

        const dueInput = new TextInputBuilder()
        .setCustomId("due_input")
        .setLabel("Due date")
        .setPlaceholder("DD-MM-YYYY")
        .setValue(oldHomework.due_date)
        .setStyle(TextInputStyle.Short);


        const ActionRow1:any = new ActionRowBuilder().addComponents(subjectInput);
        const ActionRow2:any = new ActionRowBuilder().addComponents(nameInput);
        const ActionRow3:any = new ActionRowBuilder().addComponents(desInput);
        const ActionRow4:any = new ActionRowBuilder().addComponents(pageInput);
        const ActionRow5:any = new ActionRowBuilder().addComponents(dueInput);

        add_hw_modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5);
        await interaction.showModal(add_hw_modal)

        const submitted = await interaction.awaitModalSubmit({
            time: 120000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error)
            return;
        })

        if (submitted){
            submitted.reply({
                content: `Added to assignment`,
                ephemeral: true
            });

            let [subject_input, name_input, description_input, page_input, due_input] = await Promise.all([
                submitted.fields.getTextInputValue("subject_input"),
                submitted.fields.getTextInputValue("name_input"),
                submitted.fields.getTextInputValue("des_input"),
                submitted.fields.getTextInputValue("page_input"),
                submitted.fields.getTextInputValue("due_input"),
            ]);

            let homework: homeworkConfig = {
                name: subject_input,
                subject: name_input,
                description: description_input,
                page: page_input,
                due_date: due_input
            };

            const handler = new sqlHandler();
            const connectionNew = await handler.createConnection();
            const res: any = await handler.updateHomework(connectionNew, homework, homeworkID);
            connectionNew.end();
        }
    }
};