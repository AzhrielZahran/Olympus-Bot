const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Membuat panel verifikasi")
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Pilih role yang diberikan")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Pilih channel untuk panel verifikasi")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        ),

    async execute(interaction) {
        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");

        const embed = new EmbedBuilder()
            .setTitle("🏛️ Olympus Verification")
            .setDescription(
                "Selamat datang di **Olympus**!\n\n" +
                "Klik tombol **Verify** di bawah untuk melakukan verifikasi " +
                `dan mendapatkan role **${role.name}**.`
            )
            .setColor(0x5865F2);

        const button = new ButtonBuilder()
            .setCustomId(`verify_${role.id}`)
            .setLabel("Verify")
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await channel.send({
            embeds: [embed],
            components: [row]
        });

        await interaction.reply({
            content: `✅ Panel verifikasi berhasil dikirim ke ${channel}.`,
            ephemeral: true
        });
    }
};