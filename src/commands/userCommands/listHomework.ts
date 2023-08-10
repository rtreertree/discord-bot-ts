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
                {name:"All" , value:"all"},
                {name:"Undone" , value:"undone_homework"},
                {name:"Done" , value:"done_homework"},
            ]
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const filterMode:any = interaction.options.get('mode', true).value;
        const handler = new sqlHandler();
        const connection = await handler.createConnection();

        const res = await handler.listHomeworks(connection, interaction.user.id, filterMode);
        console.log(filterMode);
    }
}