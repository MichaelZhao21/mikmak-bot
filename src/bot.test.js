const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./files/config.json');
const birthdays = require('./files/birthdays.json');

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    var specialKid = birthdays[0];

    // Test stuff here!
    const guild = client.guilds.cache.find((g) => g.name === specialKid.guild);

    const channel = guild.channels.cache.find(
        (ch) => ch.name === specialKid.channel
    );

    const user = guild.members.cache.find(
        (m) => m.user.username === specialKid.username
    ).user;

    const message = new Discord.MessageEmbed()
        .setColor(specialKid.color)
        .setTitle('HAPPY BIRTHDAY!!!')
        .setURL(specialKid.link)
        .setAuthor(user.username, user.avatarURL())
        .setDescription(specialKid.desc)
        .setThumbnail("https://api.michaelzhao.xyz/images/birthday-cake-rainbow.png")
        .setImage("https://api.michaelzhao.xyz/images/eat-cake.gif")
        .setTimestamp()
        .setFooter(specialKid.footer);

    channel.send(message);
});

client.on('message', (message) => {});

client.login(config.token);
