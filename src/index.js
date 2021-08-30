const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const {
    sendMessage, 
    sendLocationMessage, 
    sendFile, 
    sendAudioMessage, 
    join, 
    disconnect,
} = require('./triggers');
const youtubeSeach = require('./utils/getYoutubeUrl');
const speechRecognition = require('./utils/speechRecognition');
const routes = require('./routes/fileUpload');
const processDownload = require('./utils/proccessDownload');

const app = express();
app.use(cors());
app.use(routes);

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());

io.on('connection', (socket) => {
    try {
        socket.on('join', ({ username, room, password }, cb) => join(username, room, cb, socket, io, password));

        socket.on('sendMessage', (message, cb) => sendMessage(message, cb, socket));

        socket.on('sendLocation', ({ lat, lon }, cb) => sendLocationMessage(lat, lon, cb, socket));

        socket.on('sendFile', ({ file, mimeType, preview, fileName, ext }) => sendFile(file, mimeType, preview, fileName, ext, socket));

        socket.on('audioFile', async (audioBuffer) => {
            let audioText = '';

            audioText = await speechRecognition(audioBuffer);

            if (audioText.includes('subprocess error exit')) {
                audioText = 'Não foi possivel transcrever o audio';
            }

            sendAudioMessage(audioBuffer.toString('base64'), 'audio/wav', 'audio.wav', '.wav', audioText, socket);
        });

        socket.on('disconnect', () => disconnect(io, socket));
    } catch (e) {
        console.log('Ocorreu um erro inesperado', e.message);
    }

    socket.on('botCommand', async (message) => {
        const videoId = await youtubeSeach(message);

        await processDownload(videoId, socket, message);
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});