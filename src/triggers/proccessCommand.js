const { spawn } = require('child_process');

const processCommand = async (message) => {
    const {1: command} = message.split(' ');
    let child = '';
    
    if (command === 'play') {
        child = spawn('python', ['src/utils/botAssistant.py', message.substr(11)]);
    }

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
};

module.exports = processCommand;