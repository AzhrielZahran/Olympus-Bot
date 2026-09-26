const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { removeXP } = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removexp")
        .setDescription("Mengurangi XP dari user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User yang XP-nya dikurangi")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("xp")
                .setDescription("Jumlah XP yang dikurangi")
                .setMinValue(1)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("xp");

        const data = removeXP(user.id, amount);

        await interaction.reply({
            content:
                `✅ Berhasil mengurangi **${amount} XP** dari ${user}.\n` +
                `✨ Total XP: **${data.xp} XP**`,
            ephemeral: true
        });
    }
};