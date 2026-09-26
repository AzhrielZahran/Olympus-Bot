module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "❌ Terjadi error.",
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: "❌ Terjadi error.",
                        ephemeral: true
                    });
                }
            }

            return;
        }

        if (interaction.isButton()) {
            if (!interaction.customId.startsWith("verify_")) {
                return;
            }

            const roleId = interaction.customId.replace("verify_", "");
            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({
                    content: "❌ Role tidak ditemukan.",
                    ephemeral: true
                });
            }

            if (interaction.member.roles.cache.has(role.id)) {
                return interaction.reply({
                    content: "✅ Kamu sudah memiliki role tersebut.",
                    ephemeral: true
                });
            }

            try {
                await interaction.member.roles.add(role);

                await interaction.reply({
                    content: `✅ Berhasil! Kamu mendapatkan role **${role.name}**.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error(error);

                await interaction.reply({
                    content: "❌ Bot tidak bisa memberikan role tersebut. Pastikan role bot berada di atas role yang dipilih.",
                    ephemeral: true
                });
            }
        }
    }
};