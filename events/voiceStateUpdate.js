const { addVoiceMinutes } = require("../database/database");

const activeUsers = new Set();

module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState) {
        const member = newState.member || oldState.member;

        if (!member) return;
        if (member.user.bot) return;

        const wasInVoice = Boolean(oldState.channelId);
        const isInVoice = Boolean(newState.channelId);

        if (!wasInVoice && isInVoice) {
            activeUsers.add(member.id);
        }

        if (wasInVoice && !isInVoice) {
            activeUsers.delete(member.id);
        }
    },

    activeUsers
};

setInterval(() => {
    for (const userId of activeUsers) {
        addVoiceMinutes(userId, 1);
    }
}, 60 * 1000);