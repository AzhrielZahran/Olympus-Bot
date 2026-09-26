const { SlashCommandBuilder } = require("discord.js");
const {
    getUser,
    getRequiredXP
} = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Melihat profile level dan XP")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User yang ingin dilihat")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        const data = getUser(user.id);

        const currentLevelXP = getRequiredXP(data.level);
        const nextLevelXP =
            data.level >= 1000
                ? currentLevelXP
                : getRequiredXP(data.level + 1);

        const voiceHours = Math.floor(data.voice_minutes / 60);
        const voiceMinutes = data.voice_minutes % 60;

        await interaction.reply({
            content:
                `🏛️ **${user.username}**\n\n` +
                `📊 Level **${data.level}**\n` +
                `✨ XP **${data.xp.toLocaleString()} / ${nextLevelXP.toLocaleString()}**\n` +
                `💬 Chat **${data.message_count.toLocaleString()} kali**\n` +
                `🎙️ Voice Time **${voiceHours} jam ${voiceMinutes} menit**`,
            ephemeral: false
        });
    }
};