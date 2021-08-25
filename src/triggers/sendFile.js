const { generateFileMessage } = require('../utils/messages');
const { addFile } = require('../utils/files');
const { getUser, updateUser } = require('../utils/users');

const sendFile = (file, mimeType, preview, fileName, ext, socket) => {
    const user = getUser(socket.id);

    //const fileBuffer = Buffer.from(file);

    const userFiles = [
        ...user.files,
        {
            file,
            mimeType,
            fileName,
            ext
        }
    ];

    updateUser(user.id, { files: userFiles });
    addFile(user.id, file, mimeType, fileName, ext);

    socket.broadcast.to(user.room).emit('fileMessage', generateFileMessage(user.username, user.room, mimeType, fileName, ext));
    socket.emit('fileMessage', generateFileMessage(user.username, user.room, mimeType, fileName, ext, 1));

};

module.exports = sendFile;