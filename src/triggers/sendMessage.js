const Filter = require('bad-words');
const { generateMessage } = require('../utils/messages');
const { getUser } = require('../utils/users');

const sendMessage = (message, cb, socket) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(message)) {
        return cb('Profanity is not allowed');
    }

    socket.broadcast.to(user.room).emit('message', generateMessage(user.username, message));
    socket.emit('message', generateMessage(user.username, message, 1));

    cb();
};

module.exports = sendMessage;