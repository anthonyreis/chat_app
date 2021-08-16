const { removeUser, getUsersInRoom } = require('../utils/users');
const { removeRoom } = require('../utils/rooms');
const { generateMessage } = require('../utils/messages');
const { eraseHistory } = require('../utils/history');

const disconnect = (io, socket) => {
    const user = removeUser(socket.id);

    if (user) {
        io.to(user.room).emit('message', generateMessage('Admin', user.room, `${user.username} has left!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        const qtdUsers = getUsersInRoom(user.room);

        if (qtdUsers.length === 0) {
            removeRoom(user.room);
            eraseHistory(user.room);
        }
    }
};

module.exports = disconnect;