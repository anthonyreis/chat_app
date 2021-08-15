const { generateLocationMessage } = require('../utils/messages');
const { getUser } = require('../utils/users');

const sendLocationMessage = (lat, lon, cb, socket) => {
    const user = getUser(socket.id);

    socket.broadcast.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${lat},${lon}`));
    socket.emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${lat},${lon}`, 1));

    cb();
};

module.exports = sendLocationMessage;