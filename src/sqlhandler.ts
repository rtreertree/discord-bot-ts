import * as mysql from "mysql2/promise";

export interface sqlConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
    multipleStatements: boolean;
};

export class sqlHandler {
    private config: sqlConfig = {
        "host": "193.31.31.132",
        "user": "u95931_CMD1w5Zr48",
        "password": "2IE9BGEwK+rsVgce.uAgqj88",
        "database": "s95931_user",
        "connectionLimit": 10,
        "multipleStatements": true
    };
    constructor (){

    }
    //Create connection;
    public createConnection = async (): Promise<mysql.Connection> => {
        return mysql.createConnection(this.config);
    };
    // : Promise<mysql.OkPacket | mysql.ResultSetHeader | mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket[]>
    public getUserData = async (connection: mysql.Connection, userid: string) => {
        return connection.query("SELECT * FROM user_data WHERE user_id = ?", userid).then(([rows, fields]) => rows);
    }
}