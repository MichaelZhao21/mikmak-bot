const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (message.content.startsWith(config.prefix)) {
        message.channel.send("Hewwo :DDD");
    }
})

client.login(config.token);