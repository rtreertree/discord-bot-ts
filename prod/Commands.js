"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const pong_1 = require("./commands/pong");
const register_1 = require("./commands/adminCommands/register");
const addHomework_1 = require("./commands/adminCommands/addHomework");
exports.Commands = [pong_1.pong, register_1.register, addHomework_1.addHomework];
