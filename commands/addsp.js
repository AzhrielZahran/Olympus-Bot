const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addXP } = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addxp")
        .setDescription("Menambahkan XP kepada user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User yang mendapatkan XP")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("xp")
                .setDescription("Jumlah XP yang ditambahkan")
                .setMinValue(1)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("xp");

        const data = addXP(user.id, amount);

        await interaction.reply({
            content:
                `✅ Berhasil menambahkan **${amount} XP** kepada ${user}.\n` +
                `✨ Total XP: **${data.xp} XP**`,
            ephemeral: true
        });
    }
};