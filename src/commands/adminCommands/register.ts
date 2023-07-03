import { User, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommand} from "discord.js";
import { Command } from "../../Command"
import { sqlHandler, user } from "../../sqlhandler"


export const register: Command = {
    name: "register",
    description: "Register this user",
    options: [
        {
            name: "user",
            description: "User to regeister",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction : CommandInteraction) => {
        
        const user: User | any = interaction.options.getUser("user", false);

        if (user !== null) {
            if (user.bot) {
                interaction.reply({
                    content: `Cannot register bots`,
                    ephemeral: true
                });
                return;
            }
        }
        if (interaction.user.bot) {
            interaction.reply({
                content: `Bots cannot use this command`,
                ephemeral: true
            });
            return;
        }

        let username: string;
        let userid: string;
        if (user) {
            username = user.username;
            userid = user.id;
        } else {
            username = interaction.user.username;
            userid = interaction.user.id;
        }

        const handler: sqlHandler = new sqlHandler();
        const connection = await handler.createConnection();
        const res = await handler.registerUser(connection ,username, userid);
        connection.end();

        if (res) {
            interaction.reply({
                content: `Registered <@${userid}>`,
                ephemeral: true
            });
            console.log(`[INFO] command: register ${userid}, ${username}`);
        }else {
            interaction.reply({
                content: `User <@${userid}> maybe already be registered`,
                ephemeral: true
            });
            console.log(`[INFO] command: register failed to register user id: ${userid}`);
        }
        
    }
}