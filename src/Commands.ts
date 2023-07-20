import { Command } from "./Command";
import { ping } from "./commands/ping";
import { register } from "./commands/adminCommands/register";
import { addHomework } from "./commands/adminCommands/addHomework";
import { deleteHomework } from "./commands/adminCommands/deleteHomework";
import { dropall } from "./commands/adminCommands/dropAll";
import { editHomework } from "./commands/adminCommands/editHomework"

export const Commands: Command[] = [ping, register, addHomework, deleteHomework, dropall, editHomework];