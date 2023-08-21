import { Client, GatewayIntentBits, ClientOptions, User } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

//import Listener
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageReactionAdd from "./listeners/messageReactionAdd";
import inviteListener from "./listeners/inviteListener";


console.log("Starting . . .")

const token = process.env.TOKEN;
const guild_id = process.env.GUILD_ID;
const app_id = process.env.APP_ID;

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessages
    ]
});

ready(client);
interactionCreate(client);
messageReactionAdd(client);
inviteListener(client);


client.login(token);

