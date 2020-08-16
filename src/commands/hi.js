const { Client, Message } = require("discord.js")

/**
 * 
 * @param {Client} client 
 * @param {Array<string>} args 
 * @param {Message} message 
 */
module.exports = (client, args, message) => {
    if (args.length < 2) {
        message.channel.send("hello world!")
    }
}