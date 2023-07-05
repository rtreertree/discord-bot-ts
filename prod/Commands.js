"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const ping_1 = require("./commands/ping");
const register_1 = require("./commands/adminCommands/register");
const addHomework_1 = require("./commands/adminCommands/addHomework");
const deleteHomework_1 = require("./commands/adminCommands/deleteHomework");
const dropAll_1 = require("./commands/adminCommands/dropAll");
exports.Commands = [ping_1.ping, register_1.register, addHomework_1.addHomework, deleteHomework_1.deleteHomework, dropAll_1.dropall];
