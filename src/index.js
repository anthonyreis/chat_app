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
const { getUser } = require('./utils/users');

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
            const fileId = Math.floor(new Date() / 1000);

            audioText = await speechRecognition(audioBuffer, socket.id, fileId);

            if (audioText.includes('subprocess error exit')) {
                audioText = 'Não foi possivel transcrever o audio';
            }

            sendAudioMessage(audioBuffer.toString('base64'), 'audio/wav', `${socket.id}${fileId}`, '.wav', audioText, socket, fileId);
        });

        socket.on('disconnect', () => disconnect(io, socket));
    } catch (e) {
        console.log('Ocorreu um erro inesperado', e.message);
    }

    socket.on('botCommand', async (message) => {
        const {1: command} = message.split(' ');
        const user = getUser(socket.id);

        if (command === 'play') {
            const videoId = await youtubeSeach(message);

            await processDownload(videoId, socket, message);

            return null;
        }

        if (command === 'pause') {
            socket.emit('stopAudio');
            socket.broadcast.to(user.room).emit('stopAudio');

            return null;
        }
        
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});