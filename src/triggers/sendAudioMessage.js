const {getUser} = require('../utils/users');
const {generateAudioMessage} = require('../utils/messages');

const sendAudioMessage = (file, mimeType, fileName, ext, audioText, socket) => {
    const user = getUser(socket.id);
    const textId = Math.floor(new Date() / 1000);

    socket.broadcast.to(user.room).emit('audioMessage', generateAudioMessage(user.username, file, fileName, mimeType, audioText, textId, ext));
    socket.emit('audioMessage', generateAudioMessage(user.username, file, fileName, mimeType, ext, audioText, textId, 1));

};

module.exports = sendAudioMessage;