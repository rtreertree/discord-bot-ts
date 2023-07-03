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
    await handler.ThisFunctinForClearTheDatabase(connection);
    // const [hw1, hw2, hw3] = await Promise.all([
    //     handler.addHomework(connection, homework1),
    //     handler.addHomework(connection, homework2),
    //     handler.addHomework(connection, homework3),
    // ]);
    // console.log(hw1, hw2, hw3)
    // handler.updateHomeworkMessage(connection,"this is a message id","8eCU7ghufGEnMkB8J4fKeW");
    connection.end();
})();
