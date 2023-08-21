import { Client, Events, Guild } from "discord.js";
import { sqlHandler } from "../sqlhandler";

export default (client: Client): void => {
    // console.log("Add message reaction");
    client.on(Events.GuildCreate, async (guild: Guild) => {


        console.log(`Joined a new server ${guild.name} (${guild.id})`);


    });


    client.on(Events.GuildDelete, async (guild: Guild) => {
        console.log(`Left a server ${guild.name} (${guild.id}) sad ;(`);
    });
};