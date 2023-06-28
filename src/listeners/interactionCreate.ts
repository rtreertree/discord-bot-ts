import { Interaction, Client, CommandInteraction, BaseInteraction} from "discord.js";
import { Commands } from "../Commands"

export default (client : Client): void => {
    client.on("interactionCreate", async (interaction : Interaction) => {
        console.log(interaction.user)
        if (interaction.isCommand()){
            await handleSlashCommand(client, interaction);
        }
    })
}
const handleSlashCommand = async (clinet : Client, interaction : CommandInteraction) => {
    //Handle commands
    const slashCommand: any = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({content: "An error occurred"});
    }
    slashCommand.run(clinet, interaction)
}