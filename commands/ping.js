const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Cek apakah bot aktif"),

    async execute(interaction) {
        await interaction.reply("🏓 Pong!");
    }
};
