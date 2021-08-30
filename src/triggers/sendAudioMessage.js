const {getUser} = require('../utils/users');
const {generateAudioMessage} = require('../utils/messages');

const sendAudioMessage = (file, mimeType, fileName, ext, audioText, socket, fileId) => {
    const user = getUser(socket.id);

    socket.broadcast.to(user.room).emit('audioMessage', generateAudioMessage(user.username, user.room, file, fileName, mimeType, ext, audioText, fileId));
    socket.emit('audioMessage', generateAudioMessage(user.username, user.room, file, fileName, mimeType, ext, audioText, fileId, 1));
};

module.exports = sendAudioMessage;