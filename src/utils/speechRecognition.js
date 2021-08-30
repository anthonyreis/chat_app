const { spawn } = require('child_process');
const fs = require('fs');

const speechRecognition = async (buffer, id, fileId) => {
    try {
        fs.writeFile(`public/audioSent/${id}${fileId}.ogg`, buffer, function (err) {
            if (err) {
                return err.message;
            }
        });
 
        const child = spawn('python', ['src/utils/audioToText.py', id, fileId]);

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
            fs.unlink(`public/audioSent/${id}${fileId}.wav`, (error) => {
                if (error) {
                    return null;
                }
            });
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }

        return data;

    } catch (e) {
        return e.message;
    }
};

module.exports = speechRecognition;