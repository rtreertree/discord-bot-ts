import { Connection } from "mysql2/promise";
import { sqlHandler } from "./sqlhandler";
const handler = new sqlHandler();

(async () => {
    const connection = await handler.createConnection();
    const userdata = await handler.getUserData(connection, "765105219729883158");

    console.log(userdata);
})(); 