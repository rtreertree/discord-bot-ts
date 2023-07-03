"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    console.log("Add message reaction");
    client.on("messageReactionAdd", async (reaction, user) => {
        console.log(reaction.count);
    });
};
