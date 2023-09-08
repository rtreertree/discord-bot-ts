import { Command } from "./Command";
import { ping } from "./commands/ping";
import { register } from "./commands/adminCommands/register";
import { addHomework } from "./commands/adminCommands/addHomework";
import { deleteHomework } from "./commands/adminCommands/deleteHomework";
import { dropall } from "./commands/adminCommands/dropAll";
import { editHomework } from "./commands/adminCommands/editHomework"
import { settings } from "./commands/userCommands/settings";
import { listHomework } from "./commands/userCommands/listHomework";
import { getInfo } from "./commands/userCommands/getInfo";
import { done } from "./commands/userCommands/done";
import { undodone } from "./commands/userCommands/undoDone";
import { setstatus } from "./commands/adminCommands/setstatus";
import { botsetup } from "./commands/adminCommands/botsetup";

export const Commands: Command[] = [
    ping, 
    register, 
    addHomework, 
    deleteHomework, 
    dropall, 
    editHomework, 
    settings, 
    listHomework,
    getInfo,
    done,
    undodone,
    setstatus,
    botsetup,
];