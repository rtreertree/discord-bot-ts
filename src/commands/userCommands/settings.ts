import { CommandInteraction, Client, ApplicationCommandType} from "discord.js";
import { sqlHandler, user } from "../../sqlhandler"
import { Command } from "../../Command"

export const settings: Command = {
    name: "settings",
    description: "View/Change your settings",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction : CommandInteraction) => {
        
    }
}