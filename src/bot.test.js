const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./files/config.json');
const birthdays = require('./files/birthdays.json');

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    
});

client.on('message', (message) => {
    if (!message.author.bot) {
        // message.channel.send();
    }
});

client.login(config.token);
