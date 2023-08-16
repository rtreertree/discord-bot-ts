"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("../Commands");
exports.default = (client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        // let rl = createInterface(process.stdin, process.stdout);
        // rl.on('line', async (line: string) => {
        //     const handler = new sqlHandler();
        //     const connection = await handler.createConnection();
        //     const users: any = await handler.getDMableUser(connection);
        //     for (let i = 0; i < users.length; i++) {
        //         const id = users[i]["user_id"]
        //         const user = await client.users.fetch(id);
        //         console.log(`${user?.id} : ${line}`);
        //         user?.send(line);
        //     };
        // });
        await client.application.commands.set(Commands_1.Commands);
        console.log(`${client.user.username} is online`);
    });
};
