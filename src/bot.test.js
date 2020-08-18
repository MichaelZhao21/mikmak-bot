const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./files/config.json');

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Test stuff here!
});

client.on('message', (message) => {
});

client.login(config.token);
