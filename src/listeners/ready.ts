import { Client } from "discord.js";
import { Commands } from "../Commands";
import { createInterface } from"readline";
import { sqlHandler } from "../sqlhandler"

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        let rl = createInterface(process.stdin, process.stdout);
        rl.on('line', async (line: string) => {
            // const user = await client.users.fetch('461529192094367744');
            // console.log(`${user?.id} : ${line}`);
            // user?.send(line);

            const handler = new sqlHandler();
            const connection = await handler.createConnection();

            const users = await handler.getDMableUser(connection);
        });

        await client.application.commands.set(Commands)
        console.log(`${client.user.username} is online`);
    });
}