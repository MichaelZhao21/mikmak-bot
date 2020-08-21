const { Message } = require('discord.js');
const emojis = require('../files/emojis.json');

/**
 * Airdrops fruit!
 * @param {Array<string>} args
 * @param {Message} message
 */
module.exports = (args, message) => {
    const user = message.author.toString();

    if (args.length < 2)
        message.channel.send(`${user}\n:airplane:\n\nAirdropped Nothing!`);
    else {
        const errors = [];

        message.channel.send(':airplane:').then(async (botMessage) => {
            for (var i = 1; i < args.length; i++) {
                const ad = await airdrop(args, i, message, emojis);
                if (!ad) errors.push(args[i]);
            }

            if (errors.length === args.length - 1) {
                botMessage.delete();
            }

            if (errors.length === 0) return;

            if (errors.length === 1) {
                message.channel.send(
                    `${user} Bruh ${errors[0]} isn't an emoji`
                );
                return;
            }

            var errorString = '';
            errors.forEach(() => {
                errorString += errors + ', ';
            });
            errorString.substring(0, errorString.length - 2);

            message.channel.send(`${user} Bruh ${errorString} aren't emojis`);
        });
    }
};

async function airdrop(args, index, message, emojis) {
    var unicodeIndex = emojis.unicode.indexOf(args[index]);
    var nameIndex = emojis.names.indexOf(args[index]);
    if (unicodeIndex !== -1) {
        console.log(unicodeIndex)
        await message.channel
            .send(`:${emojis.names[unicodeIndex]}:`)
            .then(() => message.react(args[index]));
        return true;
    } else if (nameIndex !== -1) {
        await message.channel
            .send(`:${args[index]}:`)
            .then(() => message.react(emojis.unicode[nameIndex]));
        return true;
    } else {
        return false;
    }
}
