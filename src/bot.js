const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('cron');
const config = require('./files/config.json');
const birthdays = require('./files/birthdays.json');
const hiCommand = require('./commands/hi');
const airdropCommand = require('./commands/airdrop');
const birthday = require('./actions/birthday');

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Do stuff at midnight
    let job = new cron.CronJob('10 00 00 * * *', midnightTask);
    job.start();
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    
    if (args.length === 0) return; //TODO: add test for non alphanumeric char

    if (args[0] === 'airdrop') airdropCommand(client, args, message);
    else hiCommand(client, args, message);
});

client.login(config.token);

const loop = () => {
}

const midnightTask = () => {
    birthdays.forEach((bd) => {
        var date = bd.date.split('/');
        if (isDateSameAsToday(date)) {
            birthday(client, bd, new Date().getFullYear() - parseInt(date[2]));
        }
    });
}

const isDateSameAsToday = (dateArr) => {
    var today = new Date();
    return parseInt(dateArr[0]) - 1 === today.getMonth() && parseInt(dateArr[1]) === today.getDate();
}