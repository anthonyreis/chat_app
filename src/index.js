const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const multer = require('multer');
const sharp = require('sharp');
const sendMessage = require('./triggers/sendMessage');
const sendLocationMessage = require('./triggers/sendLocationMessage');
const sendFile = require('./triggers/sendFile');
const join = require('./triggers/join');
const disconnect = require('./triggers/disconnect');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|pdf)$/)) {
            cb(new Error('Please upload an image (jpg, jpeg, png or pdf)'));
        }

        cb(undefined, true);
    }
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());

app.post('/chat.html?', upload.single('upfile'), async (req, res) => {
    try {
        const file = req.file.buffer;
        const mimeType = req.file.mimetype;

        const { 0: fileName, 1: ext } = req.file.originalname.split('.');

        const resizableExt = ['jpg', 'jpeg', 'png'];

        if (!resizableExt.includes(ext.toLowerCase())) {
            return res.send({
                file: file.toString('base64'),
                preview: file.toString('base64'),
                mimeType,
                fileName,
                ext
            });
        }

        const buffer = await sharp(file)
            .resize(200, 200, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })
            .png()
            .toBuffer();

        res.send({
            file: file.toString('base64'),
            preview: buffer.toString('base64'),
            mimeType,
            fileName,
            ext
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});

io.on('connection', (socket) => {
    socket.on('join', ({ username, room, password }, cb) => join(username, room, cb, socket, io, password));

    socket.on('sendMessage', (message, cb) => sendMessage(message, cb, socket));

    socket.on('sendLocation', ({ lat, lon }, cb) => sendLocationMessage(lat, lon, cb, socket));

    socket.on('sendFile', ({ file, mimeType, preview, fileName, ext }) => sendFile(file, mimeType, preview, fileName, ext, socket));

    socket.on('disconnect', () => disconnect(io, socket));
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});