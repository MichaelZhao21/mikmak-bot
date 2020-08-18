const request = require('request');
const fs = require('fs');
const path = require('path');

request('https://gist.githubusercontent.com/Vexs/9e4c14d41161590ca94d0d21e456fef0/raw/3f02a866293ef35cbd5bae8cf7aeaea3ba3aa603/emoji_map_diversity.json', function(error, response, body) {
    if (!error && response.statusCode === 200) {
        const obj = JSON.parse(body);
        var data = JSON.stringify({ list: Object.keys(obj) });
        fs.writeFileSync(path.join(__dirname, '..', 'files', 'emojis.json'), data);
    }
});
