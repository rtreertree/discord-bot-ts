import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType} from "discord.js";
import { sqlHandler } from "../../sqlhandler"
import { Command } from "../../Command"

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
        const homeworkID: any = interaction.options.get("id", true).value;
        
    }
};