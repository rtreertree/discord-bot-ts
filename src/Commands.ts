import { Command } from "./Command";
import { pong } from "./commands/pong";
import { register } from "./commands/adminCommands/register";
import { addHomework } from "./commands/adminCommands/addHomework";

export const Commands: Command[] = [pong, register, addHomework];