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
        if (emojis.list.indexOf(args[1]) !== -1) {
            message.channel.send(`${user}\n:airplane:\n:${args[1]}:\nAirdropped ${args[1]}!`);
        }
        else {
            message.channel.send(`${user} Bruh ${args[1]} isn't an emoji`);
        }
    }
};
