"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlHandler = void 0;
const mysql = __importStar(require("mysql2/promise"));
const short_uuid_1 = require("short-uuid");
;
class sqlHandler {
    config = {
        "host": "193.31.31.159",
        "user": "u99291_ZYAmDB3Fub",
        "password": "K6ye@NiwvX+mOf1Ct+zugZAB",
        "database": "s99291_databot",
        "connectionLimit": 10,
        "multipleStatements": true
    };
    constructor() {
    }
    //Create connection;
    createConnection = () => {
        return mysql.createConnection(this.config);
    };
    ThisFunctinForClearTheDatabase = async (connection) => {
        await connection.query(`UPDATE user_table SET undone_homework="[]", done_homework="[]"`);
        await connection.query("truncate homework_table;");
        return;
    };
    getUserData = async (connection, userid) => {
        return connection.query("SELECT * FROM user_table WHERE user_id = ?", userid).then(([rows, fields]) => rows);
    };
    addHomework = async (connection, homework) => {
        homework.due_date = homework.due_date.split('/').join(',').split('-').join(',').split(',').reverse().join("-");
        const hw_uuid = (0, short_uuid_1.generate)();
        const [id, fields] = await connection.query("INSERT INTO homework_table(hw_subject,hw_name,hw_description,hw_page,hw_duedate,hw_uuid) VALUES (?,?,?,?,?,?);", [
            homework.subject,
            homework.name,
            homework.description,
            homework.page,
            homework.due_date,
            hw_uuid, []
        ]);
        connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework,']',',"${id.insertId}"]');`);
        connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework, '[,' , '[');`);
        return { homework_uuid: hw_uuid, homework_id: id.insertId };
    };
    updateHomeworkMessage = async (connection, message_id, hw_uuid) => {
        const [id, fields] = await connection.query(`UPDATE homework_table SET hw_messageID=? WHERE hw_uuid=?`, [message_id, hw_uuid]);
        console.log(id, fields);
        return id;
    };
    registerUser = async (connection, username, userid) => {
        try {
            await connection.query(`INSERT INTO user_table(user_id, user_name) VALUES(?,?)`, [userid, username]);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    getAllUserHomework = async (connection, userid) => {
        let [[userdone, userundone], homework] = await Promise.all([
            connection.query(`SELECT * FROM user_table WHERE user_id=?`, userid).then(([rows, f]) => [rows[0].undone_homework, rows[0].done_homework]),
            connection.query(`SELECT * FROM homework_table`).then(([rows, f]) => rows),
        ]);
        let userhomework = [];
        homework.forEach((element) => {
            if (userdone.includes(`"${element.homework_id}"`)) {
                element.isDone = true;
                userhomework.push(element);
            }
            else if (userundone.includes(`"${element.homework_id}"`)) {
                element.isDone = false;
                userhomework.push(element);
            }
        });
        return userhomework;
    };
    // ["1","2","3"]
    //NEED FIX: add for user_table edit;
    deleteHomework = async (connection, homeworkID) => {
        const [rows, fields] = await connection.query(`DELETE FROM homework_table WHERE hw_id=?`, homeworkID);
        if (rows.affectedRows == 1) {
            connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework,'"?"','');`, homeworkID);
            connection.query(`
            UPDATE user_table SET undone_homework=REPLACE(undone_homework,',,',',');
            UPDATE user_table SET undone_homework=REPLACE(undone_homework,',]',']');
            UPDATE user_table SET undone_homework=REPLACE(undone_homework,'[,','[');
            `);
            return true;
        }
        else {
            return false;
        }
    };
}
exports.sqlHandler = sqlHandler;
