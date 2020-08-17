const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./files/config.json');
const hiCommand = require('./commands/hi');
const airdropCommand = require('./commands/airdrop');

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    
    if (args.length === 0) return; //TODO: add test for non alphanumeric char

    if (args[0] === 'airdrop') airdropCommand(client, args, message);
    else hiCommand(client, args, message);
});

client.login(config.token);
