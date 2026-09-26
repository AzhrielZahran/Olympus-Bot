require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

// ========================================
// CREATE DISCORD CLIENT
// ========================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// ========================================
// COMMAND COLLECTION
// ========================================

client.commands = new Collection();

// ========================================
// LOAD COMMANDS
// ========================================

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        try {
            const command = require(filePath);

            if (!command.data || !command.execute) {
                continue;
            }

            client.commands.set(command.data.name, command);
        } catch (error) {
            console.error(`Gagal load command: ${file}`);
            console.error(error);
        }
    }
}

// ========================================
// LOAD EVENTS
// ========================================

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);

        try {
            const event = require(filePath);

            if (!event.name || !event.execute) {
                continue;
            }

            if (event.once) {
                client.once(
                    event.name,
                    (...args) => event.execute(...args, client)
                );
            } else {
                client.on(
                    event.name,
                    (...args) => event.execute(...args, client)
                );
            }
        } catch (error) {
            console.error(`Gagal load event: ${file}`);
            console.error(error);
        }
    }
}

// ========================================
// BOT READY
// ========================================

client.once("ready", () => {
    console.log(`Bot ready sebagai ${client.user.tag}`);
});

// ========================================
// ERROR HANDLING
// ========================================

client.on("error", error => {
    console.error("Discord Client Error:", error);
});

process.on("unhandledRejection", error => {
    console.error("Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", error => {
    console.error("Uncaught Exception:", error);
});

// ========================================
// LOGIN
// ========================================

client.login(process.env.DISCORD_TOKEN);