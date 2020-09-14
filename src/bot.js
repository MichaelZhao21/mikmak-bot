const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('cron');
const config = require('./files/config.json');
const birthdays = require('./files/birthdays.json');
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');
const airdropCommand = require('./commands/airdrop');
const nlp = require('./commands/nlp');
const birthday = require('./actions/birthday');
const joke = require('./commands/joke');
// const music = require('./commands/old-music');

const manager = new NlpManager({ languages: ['en'] });
let nlpValid = false;

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Load nlp manager
    try {
        if (fs.existsSync(path.join(__dirname, '..', 'model.nlp'))) {
            manager.load(path.join(__dirname, '..', 'model.nlp'));
            console.log('NLP Manager loaded');
            nlpValid = true;
        }
    } catch (err) {
        console.log('no nlp model!');
    }

    // Do stuff at midnight
    let job = new cron.CronJob('10 00 00 * * *', midnightTask);
    job.start();
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot)
        return;

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);

    if (args.length === 0) return; //TODO: add test for non alphanumeric char

    if (args[0] === 'airdrop') airdropCommand(args, message);
    else if (args[0] === 'joke') joke(args, message);
    // else if (
    //     args[0] === 'play' ||
    //     args[0] === 'pause' ||
    //     args[0] === 'skip' ||
    //     args[0] === 'loop' ||
    //     args[0] === 'stop'
    // )
    //     music(args, message);
    else if (nlpValid)
        nlp(message.content.slice(config.prefix.length), message, manager);
    else
        message.channel.send(
            'Natural Language Processing Broken :((( Tell Mikey about this!!!'
        );
});

client.login(config.token);

const loop = () => {};

const midnightTask = () => {
    birthdays.forEach((bd) => {
        var date = bd.date.split('/');
        if (isDateSameAsToday(date)) {
            birthday(client, bd, new Date().getFullYear() - parseInt(date[2]));
        }
    });
};

const isDateSameAsToday = (dateArr) => {
    var today = new Date();
    return (
        parseInt(dateArr[0]) - 1 === today.getMonth() &&
        parseInt(dateArr[1]) === today.getDate()
    );
};
