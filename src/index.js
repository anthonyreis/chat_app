const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');
const { addRoom, removeRoom } = require('./utils/rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());

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

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        const qtdUsers = getUsersInRoom(user.room);

        if (qtdUsers.length === 0) {
            removeRoom(user.room);
        }

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});