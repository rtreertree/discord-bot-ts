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
;
class sqlHandler {
    config = {
        "host": "193.31.31.132",
        "user": "u95931_CMD1w5Zr48",
        "password": "2IE9BGEwK+rsVgce.uAgqj88",
        "database": "s95931_user",
        "connectionLimit": 10,
        "multipleStatements": true
    };
    constructor() {
    }
    //Create connection;
    createConnection = async () => {
        return mysql.createConnection(this.config);
    };
    // : Promise<mysql.OkPacket | mysql.ResultSetHeader | mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket[]>
    getUserData = async (connection, userid) => {
        return connection.query("SELECT * FROM user_data WHERE user_id = ?", userid).then(([rows, fields]) => rows);
    };
}
exports.sqlHandler = sqlHandler;
