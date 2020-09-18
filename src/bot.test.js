const ytsr = require('ytsr');
const options = {limit: 10}
const a = async() =>{
    const results = await ytsr("dynamite bts", options);
    url = results.items.find(item => item.type === 'video').link;
    console.log(url);
}
a()