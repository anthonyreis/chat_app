const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const multer = require('multer');
const sharp = require('sharp');
const { generateMessage, generateLocationMessage, generateFileMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom, updateUser } = require('./utils/users');
const { addRoom, removeRoom } = require('./utils/rooms');
const { addFile, getUserFiles, getFiles } = require('./utils/files');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
            cb(new Error('Please upload an image (jpg, jpeg, png or pdf)'));
        }

        cb(undefined, file.originalname);
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
    const file = req.file.buffer;
    const { 0: fileName, 1: ext } = req.file.originalname.split('.');
    const buffer = await sharp(file).resize({ width: 200, height: 200 }).png().toBuffer();

    res.send({ file: file.toString('base64'), preview: buffer.toString('base64'), fileName, ext });
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});

io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, cb) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return cb(error);
        }

        socket.join(user.room);
        addRoom(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        cb();
    });

    socket.on('sendMessage', (message, cb) => {
        const user = getUser(socket.id);

        const filter = new Filter();

        if (filter.isProfane(message)) {
            return cb('Profanity is not allowed');
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));

        cb();
    });

    socket.on('sendLocation', ({ lat, lon }, cb) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${lat},${lon}`));

        cb();
    });

    socket.on('sendFile', ({ file, preview, fileName, ext }) => {
        const user = getUser(socket.id);
        const fileBuffer = Buffer.from(file);
        const userFiles = [
            ...user.files,
            {
                file: fileBuffer,
                fileName,
                ext
            }
        ];

        updateUser(user.id, { files: userFiles });
        addFile(user.id, fileBuffer, fileName, ext);

        io.to(user.room).emit('fileMessage', generateFileMessage(user.username, file, preview, fileName, ext));
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });

            const qtdUsers = getUsersInRoom(user.room);

            if (qtdUsers.length === 0) {
                removeRoom(user.room);
            }
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});