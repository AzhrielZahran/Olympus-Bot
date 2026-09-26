const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Melihat leaderboard XP"),

    async execute(interaction) {
        const users = db
            .prepare(`
                SELECT user_id, xp, level
                FROM users
                ORDER BY xp DESC
                LIMIT 10
            `)
            .all();

        if (users.length === 0) {
            return interaction.reply({
                content: "📊 Belum ada data XP.",
                ephemeral: true
            });
        }

        const leaderboard = users
            .map((user, index) => {
                return `${index + 1}. <@${user.user_id}> — Level **${user.level}** • **${user.xp} XP**`;
            })
            .join("\n");

        await interaction.reply({
            content:
                `🏆 **Olympus Leaderboard**\n\n${leaderboard}`
        });
    }
};