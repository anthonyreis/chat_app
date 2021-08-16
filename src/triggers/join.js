const { addUser, getUsersInRoom } = require('../utils/users');
const { addRoom, getRoom } = require('../utils/rooms');
const { generateMessage } = require('../utils/messages');
const rebuildHistory = require('../utils/rebuildHistory');

const join = (username, room, cb, socket, io, password) => {
    const roomToEnter = getRoom(room);

    if (roomToEnter && !roomToEnter.password && password) {
        password = undefined;
        cb({ msg: 'This room doesnt require a password' });
    } else if (roomToEnter && roomToEnter.password !== password) {
        return cb({ error: 'Password incorrect' });
    }

    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
        return cb(error);
    }

    socket.join(user.room);
    addRoom(user.room, password);

    if (roomToEnter) {
        rebuildHistory(username, room, socket);
    }

    socket.emit('message', generateMessage('Admin', user.room, 'Welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', user.room, `${user.username} has joined!`));

    io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
    });

    cb({});
};

module.exports = join;