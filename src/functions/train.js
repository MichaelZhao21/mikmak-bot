const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const manager = new NlpManager({ languages: ['en'], nlu: { log: true } });

const qInterface = readline.createInterface({
    input: fs.createReadStream(
        path.join(__dirname, '..', 'files', 'trainingQuestions.txt')
    ),
    output: process.stdout,
});

qInterface.on('line', (line) => {
    const space = line.indexOf(' ');
    const ep = line.substring(0, space);
    const q = line.substring(space + 1);
    manager.addDocument('en', q, ep);
});

qInterface.on('close', async () => {
    const hrstart = process.hrtime();
    await manager.train();
    const hrend = process.hrtime(hrstart);
    console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

    const aInterface = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, '..', 'files', 'trainingAnswers.txt')
        ),
        output: process.stdout,
    });

    aInterface.on('line', (line) => {
        const space = line.indexOf(' ');
        const ep = line.substring(0, space);
        const a = line.substring(space + 1);
        manager.addAnswer('en', ep, a);
    });

    aInterface.on('close', () => {
        manager.save(path.join(__dirname, '..', 'files', 'model.nlp'));
        console.log('\nAnswers added!');
    });
});
