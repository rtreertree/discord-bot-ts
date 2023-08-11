"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("../Commands");
const readline_1 = require("readline");
const sqlhandler_1 = require("../sqlhandler");
exports.default = (client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        let rl = (0, readline_1.createInterface)(process.stdin, process.stdout);
        rl.on('line', async (line) => {
            // const user = await client.users.fetch('461529192094367744');
            // console.log(`${user?.id} : ${line}`);
            // user?.send(line);
            const handler = new sqlhandler_1.sqlHandler();
            const connection = await handler.createConnection();
            const users = await handler.getDMableUser(connection);
            for (let i = 0; i < users.length; i++) {
                const id = users[i]["user_id"];
                const user = await client.users.fetch(id);
                console.log(`${user?.id} : ${line}`);
                user?.send(line);
            }
            ;
        });
        await client.application.commands.set(Commands_1.Commands);
        console.log(`${client.user.username} is online`);
    });
};
