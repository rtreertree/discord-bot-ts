import { Client, GatewayIntentBits, ClientOptions } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

//import Listener
import ready from "./listeners/ready"
import interactionCreate from "./listeners/interactionCreate"
//import Commands



console.log("Starting . . .")

const token = process.env.TOKEN;
const guild_id = process.env.GUILD_ID;
const app_id = process.env.APP_ID;

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

ready(client);
interactionCreate(client);

client.login(token);

