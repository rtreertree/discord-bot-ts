"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlhandler_1 = require("./sqlhandler");
const handler = new sqlhandler_1.sqlHandler();
(async () => {
    const connection = await handler.createConnection();
    const res = await handler.oldServerInit(connection, '');
    console.log(res);
})();
