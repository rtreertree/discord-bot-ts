import {Client} from "discord.js"
export default (client: Client): void => {
    // console.log("Add message reaction");
    client.on("messageReactionAdd", async (reaction, user) => {
        // console.log(reaction.count);
    });
}