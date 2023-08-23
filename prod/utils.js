"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterUser = void 0;
async function filterUser(interaction) {
    const role = interaction.guild?.roles.cache.find(role => role.name == 'admin');
    const p = await interaction.guild?.members.fetch(interaction.user.id).then((user) => user?.roles.cache.get(role.id));
    if (!p) {
        interaction.reply({
            content: "You have not permission to use this command",
            ephemeral: true,
        });
    }
    return p ? true : false;
}
exports.filterUser = filterUser;
