const { Message, MessageFlags } = require('discord.js');
const fetch = require('node-fetch');

/**
 * Airdrops fruit!
 * @param {Array<string>} args
 * @param {Message} message
 */
module.exports = (args, message) => {
    fetch('https://sv443.net/jokeapi/v2/joke/Miscellaneous,Dark,Pun?blacklistFlags=racist').then(data => data.json()).then((data) => {
        console.log(data);
	if (data.error) return;
        if (data.type === 'single') {
            message.channel.send(message.author.toString() + " " + data.joke);
        }
        else {
            message.channel.send(message.author.toString() + " " + data.setup);
            setTimeout(function() {
                message.channel.send(data.delivery);
            }, 1500);
        }
    });
}
