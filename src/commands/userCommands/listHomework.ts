import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const listHomework: Command = {
    name: "list",
    description: "See your all homework",
    options: [
        {
            name: "mode",
            description: "filter homeworks by a tag",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "All", value: "all" },
                { name: "Done", value: "done" },
                { name: "Undone", value: "undone" },
            ]
        }
    ],

    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const filterMode: any = interaction.options.get('mode', true).value;
        const handler = new sqlHandler();
        const connection = await handler.createConnection();

        const res = await handler.listHomeworks(connection, interaction.user.id, filterMode);
<<<<<<< HEAD

        connection.end();
        return;
=======
        
        if(res.length == 0){
            interaction.reply("You don't have any homeworks");
        }

        

>>>>>>> 576470084d264a8848fc1693f82f5bba2ebcef2e
    }
}

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