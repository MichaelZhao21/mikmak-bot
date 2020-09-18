const { Message, Guild } = require('discord.js');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const config = require('../files/config.json');

var queue = new Map();
var serverQueue = null;
const options = { limit: 10 };

/**
 * Airdrops fruit!
 * @param {Array<string>} args
 * @param {Message} message
 */
module.exports = (args, message) => {
    const serverQueue = queue.get(message.guild.id);
    
    switch (args[0]) {
        case 'play':
            play(args, message);
            break;
        // case 'pause':
        //     pause();
        //     break;
        case 'skip':
            skip(message, serverQueue);
            break;
        // case 'loop':
        //     loop();
        //     break;
        case 'stop':
            stopSong(message, serverQueue);
            break;
        default:
            console.error("Huhhhh??? I shouldn't be here lmao");
    }
};

/**
 * Plays the song lol
 * @param {Array<string>} args
 * @param {Message} message
 */
const play = async (args, message) => {
    if (args.length < 2) return message.channel.send('What am I playing???');

    const query = message.content
        .slice(config.prefix.length + args[0].length + 1)
        .trim();

    const vc = message.member.voice.channel;
    if (!vc)
        return message.channel.send(
            'You need to be in a voice channel to play music!'
        );

    const perms = vc.permissionsFor(message.client.user);
    if (!perms.has('CONNECT') || !perms.has('SPEAK'))
        return message.channel.send(
            "Sorry you don't have the perms for me to join :((("
        );

    var url;
    console.log('Song Search Query: ' + query);
    if (query.startsWith('https://www.youtube.com/watch?v=')) url = query;
    else {
        const results = await ytsr(query, options);
        console.log(results);
        url = results.items.find((item) => item.type === 'video').link;
    }

    const songInfo = await ytdl.getInfo(url);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueConst = {
            tc: message.channel,
            vc: vc,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        queue.set(message.guild.id, queueConst);

        queueConst.songs.push(song);

        try {
            var connection = await vc.join();
            queueConst.connection = connection;
            startSong(message.guild, queueConst.songs[0]);
        } 
        catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(
            `${song.title} has been added to the queue!`
        );
    }
};

/**
 *
 * @param {Guild} guild
 * @param {object} song
 */
const startSong = (guild, song) => {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.vc.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift();
            startSong(guild, serverQueue.songs[0]);
        })
        .on('error', (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.tc.send(`Now playing: **${song.title}**`);
};

function stopSong(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            'You have to be in a voice channel to stop the music!'
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to skip the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}