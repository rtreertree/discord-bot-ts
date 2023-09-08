"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const ping_1 = require("./commands/ping");
const register_1 = require("./commands/adminCommands/register");
const addHomework_1 = require("./commands/adminCommands/addHomework");
const deleteHomework_1 = require("./commands/adminCommands/deleteHomework");
const dropAll_1 = require("./commands/adminCommands/dropAll");
const editHomework_1 = require("./commands/adminCommands/editHomework");
const settings_1 = require("./commands/userCommands/settings");
const listHomework_1 = require("./commands/userCommands/listHomework");
const getInfo_1 = require("./commands/userCommands/getInfo");
const done_1 = require("./commands/userCommands/done");
const undoDone_1 = require("./commands/userCommands/undoDone");
const setstatus_1 = require("./commands/adminCommands/setstatus");
const botsetup_1 = require("./commands/adminCommands/botsetup");
exports.Commands = [
    ping_1.ping,
    register_1.register,
    addHomework_1.addHomework,
    deleteHomework_1.deleteHomework,
    dropAll_1.dropall,
    editHomework_1.editHomework,
    settings_1.settings,
    listHomework_1.listHomework,
    getInfo_1.getInfo,
    done_1.done,
    undoDone_1.undodone,
    setstatus_1.setstatus,
    botsetup_1.botsetup,
];
