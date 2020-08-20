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
    var output = `${getLogDateAndTime()} | "${query}" | ${response.intent} | ${
        response.score
    }\n`;
    fs.appendFile(
        path.join(__dirname, '..', 'files', 'nlpLog.txt'),
        output,
        () => {}
    );
    if (response.answer !== undefined) message.channel.send(response.answer);
    else message.channel.send('Sorry idk how to answer that yet :(');
};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getLogDateAndTime() {
    const now = new Date();
    return (
        `${now.getFullYear()}-${pad2((now.getMonth() + 1).toString())}-${pad2(now.getDate().toString())} ` +
        `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()},${now.getMilliseconds()}`
    );
}

function pad2(input) {
    return ("00" + input).slice(-2);
}
