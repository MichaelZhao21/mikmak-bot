const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { F_OK } = require('constants');

const manager = new NlpManager({ languages: ['en'], nlu: { log: true } });
var qs = '';

const getQuestions = (extra) => {
    const qInterface = readline.createInterface({
        input: fs.createReadStream(
            path.join(
                __dirname,
                '..',
                'files',
                extra ? 'extraTrainingQuestions.txt' : 'trainingQuestions.txt'
            )
        ),
        output: process.stdout,
    });

    qInterface.on('line', (line) => {
        const space = line.indexOf(' ');
        const ep = line.substring(0, space);
        const q = line.substring(space + 1);
        manager.addDocument('en', q, ep);
    });

    return qInterface;
};

const getExtraQuestions = () => {
    const log = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, '..', 'files', 'nlpLog')
        ),
        output: process.stdout,
    });

    log.on('line', (line) => {
        const args = line.split(' | ');
        if (
            parseFloat(args[3]) >= 0.9 &&
            parseFloat(args[3]) < 1.0 &&
            args[2] !== 'None'
        ) {
            qs += `${args[2]} ${args[1].substring(1, args[1].length - 1)}\n`;
        }
    });

    return log;
};

const getAnswers = async () => {
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

    return aInterface;
};

const train = async () => {
    const hrstart = process.hrtime();
    await manager.train();
    const hrend = process.hrtime(hrstart);
    console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
};

const runTraining = () => {
    const eqInterface = getExtraQuestions();
    eqInterface.on('close', async () => {
        console.log('\nParsed Extra Questions!\n');
        if (qs === '') {
            console.log('No extra interesting data');
            return;
        }
        fs.appendFileSync(
            path.join(__dirname, '..', 'files', 'extraTrainingQuestions.txt'),
            qs
        );
        fs.appendFileSync(
            path.join(__dirname, '..', 'files', 'oldNlpLog'),
            fs
                .readFileSync(path.join(__dirname, '..', 'files', 'nlpLog'))
                .toString()
        );
        fs.unlinkSync(path.join(__dirname, '..', 'files', 'nlpLog'));
        const qInterface = getQuestions(false);
        qInterface.on('close', async () => {
            console.log('\nGotten Questions!\n');
            const eq2Interface = getQuestions(true);
            eq2Interface.on('close', async () => {
                console.log('\nGotten Extra Questions!\n');
                await train();
                const aInterface = getAnswers();
                aInterface.on('close', () => {
                    console.log('\nGotten Answers!\n');
                    manager.save(
                        path.join(__dirname, '..', 'files', 'model.nlp')
                    );
                    console.log('\nModel completed!');
                });
            });
        });
    });
};

fs.access(path.join(__dirname, '..', 'files', 'nlpLog'), F_OK, (err) => {
    if (err) {
        console.log('No new data!');
        return;
    }
    runTraining();
})