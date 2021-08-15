const { addUser, getUsersInRoom } = require('../utils/users');
const { addRoom } = require('../utils/rooms');
const { generateMessage } = require('../utils/messages');

const join = (username, room, cb, socket, io) => {
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
};

module.exports = join;