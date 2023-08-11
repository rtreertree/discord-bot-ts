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
            const handler = new sqlHandler();
            const connection = await handler.createConnection();

            const users: any = await handler.getDMableUser(connection);
            for (let i = 0; i < users.length; i++) {
                const id = users[i]["user_id"]
                const user = await client.users.fetch(id);
                console.log(`${user?.id} : ${line}`);
                user?.send(line);
            };
        });

        await client.application.commands.set(Commands)
        console.log(`${client.user.username} is online`);
    });
}