const YoutubeDlWrap = require('youtube-dl-wrap');
const fs = require('fs');
const { playVideo } = require('../triggers');
let count = 0;

const downloadBinary = async (videoId, socket) => {
    if (count === 0) {
        await YoutubeDlWrap.downloadFromGithub(undefined, undefined, 'linux').then(() => {
            const youtubeDlWrap = new YoutubeDlWrap('./youtube-dl');
    
            fs.access(`./public/downloadMusic/${videoId}.mp3`, fs.F_OK, (err) => {
                if (err) {
                    setTimeout(async () => new Promise((resolve, reject) => {
                        count++;
                        youtubeDlWrap.execPromise([`https://www.youtube.com/watch?v=${videoId}`,
                            '-f', 'best', '-o', `./public/downloadMusic/${videoId}.mp3`]).then(() => resolve(playVideo(videoId, socket)));
                    }), 3000);

                    return null;
                }

                return playVideo(videoId, socket);
            });
        });
    } else {
        const youtubeDlWrap = new YoutubeDlWrap('./youtube-dl');

        fs.access(`./public/downloadMusic/${videoId}.mp3`, fs.F_OK, async (err) => {
            if (err) {
                await new Promise((resolve, reject) => {
                    youtubeDlWrap.execPromise([`https://www.youtube.com/watch?v=${videoId}`,
                        '-f', 'best', '-o', `./public/downloadMusic/${videoId}.mp3`]).then(() => resolve(playVideo(videoId, socket)));
                });

                return null;
            }

            return playVideo(videoId, socket);
        });
    }
};

module.exports = downloadBinary;