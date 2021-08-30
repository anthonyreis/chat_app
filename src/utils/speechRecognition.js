const { spawn } = require('child_process');
const fs = require('fs');

const speechRecognition = async (buffer, id) => {
    try {
        
        fs.writeFile(`public/audioSent/${id}.ogg`, buffer, function (err) {
            if (err) {
                return err.message;
            }
        });
 
        const child = spawn('python', ['src/utils/audioToText.py', id]);

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
            fs.unlink(`public/audioSent/${id}.ogg`, (error) => {
                if (error) {
                    throw new Error(`Houve um erro na remoção do arquivo, ${error}`);
                }
            });
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }

        return data;

    } catch (e) {
        console.log(e.message);
        return e.message;
    }
};

module.exports = speechRecognition;