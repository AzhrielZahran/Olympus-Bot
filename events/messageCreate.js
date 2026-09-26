const { addMessage } = require("../database/database");

module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (message.author.bot) return;
        if (!message.guild) return;

        addMessage(message.author.id);
    }
};