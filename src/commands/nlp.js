const { Message } = require('discord.js');
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

/**
 * Parses query and returns an answer using a pre-trained nlp model
 * @param {string} query
 * @param {Message} message
 * @param {NlpManager} manager
 */
module.exports = async (query, message, manager) => {
    const response = await manager.process('en', query);
    console.log(response)
    if (response.answer !== undefined) message.channel.send(response.answer);
    else message.channel.send('Sorry idk how to answer that yet :(');

    var output = `${getLogDateAndTime()} | "${query}" | ${response.intent} | ${
        response.score
    }\n`;
    fs.appendFile(
        path.join(__dirname, '..', 'files', 'nlpLog'),
        output,
        () => {}
    );
};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getLogDateAndTime() {
    const now = new Date();
    return (
        `${now.getFullYear()}-${pad2((now.getMonth() + 1).toString())}-${pad2(now.getDate().toString())} ` +
        `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())},${pad3(now.getMilliseconds())}`
    );
}

function pad2(input) {
    return ("00" + input).slice(-2);
}

function pad3(input) {
    return (input + "000").slice(-3);
}