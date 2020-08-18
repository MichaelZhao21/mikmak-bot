const { Client, Message } = require('discord.js');
const emojis = require('../files/emojis.json');

/**
 * Airdrops fruit!
 * @param {Client} client
 * @param {Array<string>} args
 * @param {Message} message
 */
module.exports = (client, args, message) => {
    const user = message.author.toString();

    if (args.length < 2)
        message.channel.send(`${user}\n:airplane:\n\nAirdropped Nothing!`);
    else if (args.length > 2)
        message.channel.send(`${user} Sorry my plane can only fit 1 item :((`);
    else {
        var unicodeIndex = emojis.unicode.indexOf(args[1]);
        var nameIndex = emojis.names.indexOf(args[1]);
        if (unicodeIndex !== -1) {
            message.channel
                .send(`:airplane:\n:${emojis.names[unicodeIndex]}:`)
                .then(() => message.react(args[1]));
        } else if (nameIndex !== -1) {
            message.channel
                .send(`:airplane:\n:${args[1]}:`)
                .then(() => message.react(emojis.unicode[nameIndex]));
                //
        } else {
            message.channel.send(`${user} Bruh ${args[1]} isn't an emoji`);
        }
    }
};
