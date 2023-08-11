import * as mysql from "mysql2/promise";
import * as sql from "mysql2";
import { generate } from "short-uuid";

export interface homeworkConfig {
    name: string;
    subject: string;
    description: string;
    page: string;
    due_date: string;
}

export interface userhomework extends homeworkConfig {
    isDone: boolean | undefined;
    message_id: string;
    uuid: string;
    homework_id: string;
}

export interface returnhomework {
    homework_id: string;
    homework_uuid: string;
}

export interface user {
    username: string;
    userid: string;
    done_homework: string;
    undone_homework: string;
    user_settings: string;
}


export enum errorType {
    INCORRECT_DATE = 0,
    ID_NOT_FOUND = 0,
}

export class sqlHandler {
    private config: mysql.ConnectionOptions = {
        "host": "193.31.31.159",
        "user": "u99291_ZYAmDB3Fub",
        "password": "K6ye@NiwvX+mOf1Ct+zugZAB",
        "database": "s99291_databot",
        "connectionLimit": 10,
        "multipleStatements": true
    };

    constructor (){

    }

    //Create connection;
    public createConnection = (): Promise<mysql.Connection> => {
        return mysql.createConnection(this.config);
    };

    public ThisFunctinForClearTheDatabase = async (connection: mysql.Connection): Promise<void> => {
        await connection.query(`UPDATE user_table SET undone_homework="[]", done_homework="[]"`);
        await connection.query("truncate homework_table;");
        return;
    }
    
    public getUserData = async (connection: mysql.Connection, userid: string) => {
        return connection.query("SELECT * FROM user_table WHERE user_id = ?", userid).then(([rows, fields]) => rows);
    };

    public getDMableUser = async (connection: mysql.Connection) => {
        return connection.query("SELECT * FROM user_table WHERE user_setting=1");
    };

    public addHomework = async (connection: mysql.Connection, homework: homeworkConfig): Promise<returnhomework | errorType>=> {
        homework.due_date = homework.due_date.split('/').join(',').split('-').join(',').split(',').reverse().join("-");
        const hw_uuid = generate();
        const [id, fields]: any = await connection.query("INSERT INTO homework_table(hw_subject,hw_name,hw_description,hw_page,hw_duedate,hw_uuid) VALUES (?,?,?,?,?,?);",
        [
            homework.subject,
            homework.name,
            homework.description,
            homework.page,
            homework.due_date,
            hw_uuid, []
        ]);
        connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework,']',',"${id.insertId}"]');`);
        connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework, '[,' , '[');`);
        return {homework_uuid: hw_uuid, homework_id: id.insertId};
    };

    public updateHomeworkMessage = async (connection: mysql.Connection, message_id: string, hw_uuid: string):Promise<any> => {
        const [id, fields]: any = await connection.query(`UPDATE homework_table SET hw_messageID=? WHERE hw_uuid=?`, [message_id, hw_uuid]);
        return id;
    };

    public registerUser = async (connection: mysql.Connection, username:string, userid:string ): Promise<boolean> => {
        try {
            await connection.query(`INSERT INTO user_table(user_id, user_name) VALUES(?,?)`, [userid, username]);
            return true;
        } catch (e) {
            return false;
        }
    };

    public getAllUserHomework = async (connection: mysql.Connection, userid: string): Promise<userhomework[]> => {
        let [[userdone,  userundone], homework]: any = await Promise.all([
            connection.query(`SELECT * FROM user_table WHERE user_id=?`, userid).then(([rows, f]: any) => [rows[0].undone_homework, rows[0].done_homework]),
            connection.query(`SELECT * FROM homework_table`).then(([rows, f]: any) => rows),
        ]);
        let userhomework: userhomework[] = [];
        homework.forEach((element: userhomework) => {
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

    public getHomeworkById = async (connection: mysql.Connection, homeworkID: Number): Promise<homeworkConfig> => {
        const [rows, fields]: any = await connection.query(`SELECT * FROM homework_table WHERE hw_id=?;`, homeworkID);
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
        }
    };

    public deleteHomework = async (connection: mysql.Connection, homeworkID: Number): Promise<boolean> => {
        const [rows, fields]: any = await connection.query(`DELETE FROM homework_table WHERE hw_id=?`, homeworkID);
        if (rows.affectedRows == 1) {
            connection.query(`UPDATE user_table SET undone_homework=REPLACE(undone_homework,'"?"','');`, homeworkID);
            connection.query(`
            UPDATE user_table SET undone_homework=REPLACE(undone_homework,',,',',');
            UPDATE user_table SET undone_homework=REPLACE(undone_homework,',]',']');
            UPDATE user_table SET undone_homework=REPLACE(undone_homework,'[,','[');
            `);
            return true;
        }else {
            return false;
        }
    };

    public updateHomework = async (connection: mysql.Connection, homework: homeworkConfig, homeworkID: Number) => {
        await connection.query(`UPDATE homework_table SET hw_description=?,hw_name=?,hw_page=?,hw_duedate=?,hw_subject=? WHERE hw_id = ?`, [
            homework.description,
            homework.name,
            homework.page,
            homework.due_date,
            homework.subject,
            homeworkID
        ])
    };

    public setUsersettings = async (connection: mysql.Connection, userid:string, settings: boolean): Promise<boolean> => {
        const [rows, fields]:any = await connection.query(`UPDATE user_table SET user_setting=? WHERE user_id=?`, [settings, userid]);
        if (rows.affectedRows != 1) {
            return false;
        }else {
            return true;
        }
    };

    public listHomeworks = async (connection: mysql.Connection,userid:string, filter: string) => {

        const [[result, fields], [homework, fields2]]:any = await Promise.all([
            connection.query(`SELECT * FROM user_table WHERE user_id=?`,userid),
            connection.query(`SELECT * FROM homework_table`),
        ]);

        console.log(result);
        let allHwIds: any[] = []; //Hw ids of all homeworks
        for (let i = 0; i < homework.length; i++) {
            allHwIds.push(`${homework[i].hw_id}`);
        }
        console.log(allHwIds);
    
        let userDoneHwIds: any[] = JSON.parse(result[0].done_homework);
        let userUndoneHwIds: any[] = JSON.parse(result[0].undone_homework);
        console.log(userDoneHwIds);
        console.log(userUndoneHwIds);

        const filteredDone = allHwIds.filter(value => userDoneHwIds.includes(value));
        const filteredUndone = allHwIds.filter(value => userUndoneHwIds.includes(value));
        console.log(filteredDone);
        console.log(filteredUndone);
        
        if (filter == "all") {
            
        } else if (filter == "done") {

        } else if (filter == "undone") {

        };
    };

};