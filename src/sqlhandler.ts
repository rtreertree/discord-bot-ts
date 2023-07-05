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

    public getHomeworkById = async (connection: mysql.Connection, homeworkID: Number): Promise<homeworkConfig | null> => {
        const [rows, fields]: any = await connection.query(`SELECT * FROM homework_table WHERE hw_id=?;`, homeworkID);
        if (rows.length != 0) {
            return {
                name: rows[0].hw_name,
                subject: rows[0].hw_subject,
                description: rows[0].hw_description,
                page: rows[0].hw_page,
                due_date: rows[0].hw_duedate
            };
        }
        return null;
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
}