const { generateFileMessage } = require('../utils/messages');
const { addFile } = require('../utils/files');
const { getUser, updateUser } = require('../utils/users');

const sendFile = (file, mimeType, preview, fileName, ext, socket) => {
    const user = getUser(socket.id);

    const fileBuffer = Buffer.from(file);
    const userFiles = [
        ...user.files,
        {
            file: fileBuffer,
            mimeType,
            fileName,
            ext
        }
    ];

    updateUser(user.id, { files: userFiles });
    addFile(user.id, fileBuffer, mimeType, fileName, ext);

    socket.broadcast.to(user.room).emit('fileMessage', generateFileMessage(user.username, user.room, file, mimeType, preview, fileName, ext));
    socket.emit('fileMessage', generateFileMessage(user.username, user.room, file, mimeType, preview, fileName, ext, 1));

};

module.exports = sendFile;