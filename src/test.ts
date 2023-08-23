import { Connection } from "mysql2/promise";
import { sqlHandler, userhomework, homeworkConfig} from "./sqlhandler";

const handler = new sqlHandler();


(async () => {
    const connection = await handler.createConnection();
    const res = await handler.oldServerInit(connection, '');
    console.log(res);
})(); 
