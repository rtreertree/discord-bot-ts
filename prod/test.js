"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlhandler_1 = require("./sqlhandler");
const handler = new sqlhandler_1.sqlHandler();
const homework1 = {
    name: "string1",
    subject: "string1",
    description: "string1",
    page: "string1",
    due_date: "1-7-2023"
};
const homework2 = {
    name: "string2",
    subject: "string2",
    description: "string2",
    page: "string2",
    due_date: "1-7-2023"
};
const homework3 = {
    name: "string3",
    subject: "string3",
    description: "string3",
    page: "string3",
    due_date: "1-7-2023"
};
(async () => {
    const connection = await handler.createConnection();
    const res = await handler.getHomeworkById(connection, 2);
    await connection.end();
    const dueDate = new Date(`${res?.due_date}`);
    console.log(dueDate.toLocaleDateString());
})();
