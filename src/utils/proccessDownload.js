const { spawn } = require('child_process');
const { playVideo } = require('../triggers');
const fs = require('fs');

const processDownload = async (videoId, socket) => {
    try {
        fs.access(`./public/downloadMusic/${videoId}.mp3`, fs.F_OK, async (err) => {
            if (err) {
                const child = spawn('python', ['src/utils/downloadFiles.py', videoId]);

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
               
                return playVideo(videoId, socket);
            }

            return playVideo(videoId, socket);
        });

    } catch (e) {
        console.log(e);
    }
};

module.exports = processDownload;