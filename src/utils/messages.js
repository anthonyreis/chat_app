const generateMessage = (username, message, flag) => ({
    username,
    message,
    color: flag ? '#CCCBFB' : '#EEEDFD',
    createdAt: new Date().getTime()
});

const generateLocationMessage = (username, url, flag) => ({
    username,
    url,
    color: flag ? '#CCCBFB' : '#EEEDFD',
    createdAt: new Date().getTime()
});

const generateFileMessage = (username, file, mimeType, preview, fileName, ext, flag) => ({
    username,
    file,
    mimeType,
    preview,
    fileName,
    ext,
    color: flag ? '#CCCBFB' : '#EEEDFD',
    createdAt: new Date().getTime()
});

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateFileMessage
};