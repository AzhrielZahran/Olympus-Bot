module.exports = {
    name: "clientReady",
    once: true,

    execute(client) {
        console.log(`Bot online sebagai ${client.user.tag}`);
    }
};