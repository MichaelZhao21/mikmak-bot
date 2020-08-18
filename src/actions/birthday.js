const Discord = require('discord.js');

module.exports = (client, bdayParams, age) => {
    const guild = client.guilds.cache.find((g) => g.name === bdayParams.guild);

    const channel = guild.channels.cache.find(
        (ch) => ch.name === bdayParams.channel
    );

    const user = guild.members.cache.find(
        (m) => m.user.username === bdayParams.username
    ).user;

    const message = new Discord.MessageEmbed()
        .setColor(bdayParams.color)
        .setTitle(`HAPPY ${age}TH BIRTHDAY!!!`)
        .setURL(bdayParams.link)
        .setAuthor(user.username, user.avatarURL())
        .setDescription(bdayParams.desc)
        .setThumbnail(
            'https://api.michaelzhao.xyz/images/birthday-cake-rainbow.png'
        )
        .setImage('https://api.michaelzhao.xyz/images/eat-cake.gif')
        .setTimestamp()
        .setFooter(bdayParams.footer);

    channel.send(user.toString() + ' :DDD');
    channel.send(message);
};
