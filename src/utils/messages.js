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

const generateFileMessage = (username, file) => ({
    username,
    file,
    createdAt: new Date().getTime()
});

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateFileMessage
};