const convertFile = require('./oggToWav');
const { spawn } = require('child_process');
const fs = require('fs');

const speechRecognition = async (buffer) => {
    try {
        const file = await convertFile(buffer);

        fs.writeFile('newFile.wav', file, function (err) {
            if (err) {
                return err.message;
            }
        });

 
        const child = spawn('python', ['src/utils/audioToText.py']);

        let data = '';

        for await (const chunk of child.stdout) {
            data += chunk;
        }

        let error = '';

        for await (const chunk of child.stderr) {
            error += chunk;
        }
        const exitCode = await new Promise((resolve, reject) => {
            child.on('close', resolve);
        });
        
        if (exitCode) {
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }

        return data;

    } catch (e) {
        return e.message;
    }
};

module.exports = speechRecognition;