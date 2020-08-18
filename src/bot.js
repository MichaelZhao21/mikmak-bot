const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./files/config.json');
const emojis = require('./files/emojis.json');
const hiCommand = require('./commands/hi');
const airdropCommand = require('./commands/airdrop');

var emojiMaps = {
    names: new Map(),
    unicode: new Map()
}

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    getEmojis().then(() => console.log("Gotten all emojis!"));

    // Do stuff every second
    setInterval(loop, 1000);
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    
    if (args.length === 0) return; //TODO: add test for non alphanumeric char

    if (args[0] === 'airdrop' && emojiMaps.unicode.get('🇺🇳') !== undefined) airdropCommand(client, args, message, emojiMaps);
    else hiCommand(client, args, message);
});

client.login(config.token);

const getEmojis = async () => {
    for (var i = 0; i < emojis.names.length; i++) {
        emojiMaps.names.set(emojis.names[i], emojis.unicode[i]);
        emojiMaps.unicode.set(emojis.unicode[i], emojis.names[i]);
    }
}

const loop = () => {
    
}