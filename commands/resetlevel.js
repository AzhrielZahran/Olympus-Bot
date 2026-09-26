const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { resetLevel } = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetlevel")
        .setDescription("Mereset XP dan level user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User yang akan direset")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        resetLevel(user.id);

        await interaction.reply({
            content:
                `🔄 XP dan level ${user} berhasil direset.\n` +
                `✨ XP: **0**\n` +
                `📊 Level: **1**`,
            ephemeral: true
        });
    }
};