const {getUser} = require('../utils/users');
const {generateAudioMessage} = require('../utils/messages');

const sendAudioMessage = (file, mimeType, fileName, ext, socket) => {
    const user = getUser(socket.id);

    socket.broadcast.to(user.room).emit('audioMessage', generateAudioMessage(user.username, file, fileName, mimeType, ext));
    socket.emit('audioMessage', generateAudioMessage(user.username, file, fileName, mimeType, ext, 1));

};

module.exports = sendAudioMessage;