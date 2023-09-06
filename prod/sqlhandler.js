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
exports.sqlHandler = exports.errorType = void 0;
const mysql = __importStar(require("mysql2/promise"));
const short_uuid_1 = require("short-uuid");
var errorType;
(function (errorType) {
    errorType[errorType["INCORRECT_DATE"] = 0] = "INCORRECT_DATE";
    errorType[errorType["ID_NOT_FOUND"] = 0] = "ID_NOT_FOUND";
})(errorType || (exports.errorType = errorType = {}));
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
    newServerInit = async (connection, guildid, hwChid, logChid) => {
        hwChid = hwChid.replace(/[<#>]/g, '');
        logChid = logChid.replace(/[<#>]/g, '');
        try {
            const [rows, fields] = await connection.query(`INSERT INTO settings_table(guildID, hwCh, logCh) VALUES(?,?,?)`, [guildid, hwChid, logChid]);
        }
        catch (error) {
            const [rows, fields] = await connection.query(`UPDATE settings_table SET hwCh=?, logCh=? WHERE guildID=?`, [hwChid, logChid, guildid]);
            return false;
        }
        return true;
    };
    getLogChannelId = async (connection, guildid) => {
        try {
            const [rows, fields] = await connection.query(`SELECT logCh FROM settings_table WHERE guildID=?`, [guildid]);
            return rows[0].logCh;
        }
        catch (error) {
            return "error";
        }
    };
    getUserData = async (connection, userid) => {
        return connection.query("SELECT * FROM user_table WHERE user_id = ?", userid).then(([rows, fields]) => rows);
    };
    getDMableUser = async (connection) => {
        return connection.query("SELECT * FROM user_table WHERE user_setting=1").then(([res, logs]) => res);
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
    getHomeworkById = async (connection, homeworkID) => {
        const [rows, fields] = await connection.query(`SELECT * FROM homework_table WHERE hw_id=?;`, homeworkID);
        if (rows.length != 0) {
            return {
                name: rows[0].hw_name,
                subject: rows[0].hw_subject,
                description: rows[0].hw_description,
                page: rows[0].hw_page,
                due_date: (new Date(`${rows[0].hw_duedate}`)).toLocaleDateString()
            };
        }
        return {
            name: "400",
            subject: "400",
            description: "400",
            page: "400",
            due_date: "400"
        };
    };
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
    markHomework = async (connection, userid, homeworkID, status) => {
        const fix = `
        UPDATE user_table SET undone_homework=REPLACE(undone_homework,',,',',');
        UPDATE user_table SET undone_homework=REPLACE(undone_homework,',]',']');
        UPDATE user_table SET undone_homework=REPLACE(undone_homework,'[,','[');
        UPDATE user_table SET done_homework=REPLACE(done_homework,',,',',');
        UPDATE user_table SET done_homework=REPLACE(done_homework,',]',']');
        UPDATE user_table SET done_homework=REPLACE(done_homework,'[,','[');
        `;
        if (status) {
            const [rows, fields] = await connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework,'"${homeworkID}"','') WHERE user_id=${userid};`);
            if (rows["changedRows"] != 0) {
                connection.query(`UPDATE user_table SET done_homework=REPLACE(done_homework,']',',"${homeworkID}"]') WHERE user_id=${userid};`);
            }
            console.log(rows["changedRows"]);
        }
        else {
            const [rows, fields] = await connection.query(`UPDATE user_table SET done_homework=REPLACE(done_homework,'"${homeworkID}"','') WHERE user_id=${userid};`);
            if (rows["changedRows"] != 0) {
                connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework,']',',"${homeworkID}"]') WHERE user_id=${userid};`);
            }
            console.log(rows["changedRows"]);
        }
        connection.query(fix);
        return true;
    };
    updateHomework = async (connection, homework, homeworkID) => {
        await connection.query(`UPDATE homework_table SET hw_description=?,hw_name=?,hw_page=?,hw_duedate=?,hw_subject=? WHERE hw_id = ?`, [
            homework.description,
            homework.name,
            homework.page,
            homework.due_date,
            homework.subject,
            homeworkID
        ]);
    };
    setUsersettings = async (connection, userid, settings) => {
        const [rows, fields] = await connection.query(`UPDATE user_table SET user_setting=? WHERE user_id=?`, [settings, userid]);
        if (rows.affectedRows != 1) {
            return false;
        }
        else {
            return true;
        }
    };
    listHomeworks = async (connection, userid, filter) => {
        const [[result, f1], [homework, f2]] = await Promise.all([
            connection.query(`SELECT * FROM user_table WHERE user_id=?`, userid),
            connection.query(`SELECT hw_id,hw_name,hw_subject,hw_description,hw_page, DATE_FORMAT(hw_duedate, '%d/%m/%Y') FROM homework_table`)
        ]);
        let userDoneHwIds = JSON.parse(result[0].done_homework);
        let userUndoneHwIds = JSON.parse(result[0].undone_homework);
        let allHomeworks = [];
        userDoneHwIds.forEach(h => {
            const id = Number(h);
            for (let i = 0; i < homework.length; i++) {
                if (id == homework[i]["hw_id"]) {
                    allHomeworks.push({
                        "homework_id": homework[i]["hw_id"],
                        "name": homework[i]["hw_name"],
                        "description": homework[i]["hw_description"],
                        "due_date": homework[i]["DATE_FORMAT(hw_duedate, '%d/%m/%Y')"],
                        "page": homework[i]["hw_page"],
                        "subject": homework[i]["hw_subject"],
                        "isDone": true
                    });
                }
            }
        });
        userUndoneHwIds.forEach(h => {
            const id = Number(h);
            for (let i = 0; i < homework.length; i++) {
                if (id == homework[i]["hw_id"]) {
                    allHomeworks.push({
                        "homework_id": homework[i]["hw_id"],
                        "name": homework[i]["hw_name"],
                        "description": homework[i]["hw_description"],
                        "due_date": homework[i]["DATE_FORMAT(hw_duedate, '%d/%m/%Y')"],
                        "page": homework[i]["hw_page"],
                        "subject": homework[i]["hw_subject"],
                        "isDone": false
                    });
                }
            }
        });
        return allHomeworks;
    };
}
exports.sqlHandler = sqlHandler;
;
