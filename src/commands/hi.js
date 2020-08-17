const { Client, Message } = require('discord.js');

/**
 *
 * @param {Client} client
 * @param {Array<string>} args
 * @param {Message} message
 */
module.exports = (client, args, message) => {
    const user = message.author.toString();

    if (args.length === 1 && args[0] === 'hi') {
        const greetings = [
            'hi',
            'hello!',
            'hewwo :3',
            'haiiiii',
            'Hiii!!!',
            'UwU',
            'heyyyy',
            'hey :))',
        ];
        message.channel.send(user + ' ' + greetings[randInt(0, greetings.length)]);
    } else {
        message.channel.send(user + ' Sorry idk how to respond to that yet TT');
    }
};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
