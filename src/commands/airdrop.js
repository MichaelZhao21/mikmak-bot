const { Client, Message } = require('discord.js');

/**
 * Airdrops fruit!
 * @param {Client} client
 * @param {Array<string>} args
 * @param {Message} message
 */
module.exports = (client, args, message, emojis) => {
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
    var unicodeIndex = emojis.unicode.get(args[index]);
    var nameIndex = emojis.names.get(args[index]);
    if (unicodeIndex !== undefined) {
        await message.channel
            .send(`:${unicodeIndex}:`)
            .then(() => message.react(args[index]));
        return true;
    } else if (nameIndex !== undefined) {
        await message.channel
            .send(`:${args[index]}:`)
            .then(() => message.react(nameIndex));
        return true;
    } else {
        return false;
    }
}
