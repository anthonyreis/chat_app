const generateMessage = (username, message) => ({
    username,
    message,
    createdAt: new Date().getTime()
});

const generateLocationMessage = (username, url) => ({
    username,
    url,
    createdAt: new Date().getTime()
});

const generateFileMessage = (username, file, mimeType, preview, fileName, ext) => ({
    username,
    file,
    mimeType,
    preview,
    fileName,
    ext,
    createdAt: new Date().getTime()
});

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateFileMessage
};