import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType} from "discord.js";
import { sqlHandler } from "../../sqlhandler"
import { Command } from "../../Command"

export const botsetup: Command = {
    name: "botsetup",
    description: "Add a homework",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        
    }
};