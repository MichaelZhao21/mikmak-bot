const request = require('request');
const fs = require('fs');
const path = require('path');

request('https://www.webfx.com/tools/emoji-cheat-sheet/', function(error, response, body) {
    if (!error && response.statusCode === 200) {
        const exp = /<span class="name".*?>(.*?)</g
        var matches = body.matchAll(exp);
        var emojis = [];
        for (const match of matches) {
            emojis.push(match[1]);
        }
        
        var data = JSON.stringify({ list: emojis });
        fs.writeFileSync(path.join(__dirname, '..', 'files', 'emojis.json'), data);
    }
});
