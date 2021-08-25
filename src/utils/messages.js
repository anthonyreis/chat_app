const { addHistory, getHistory } = require('./history');

const generateMessage = (username, room, message, flag) => {
    const msg = {
        username,
        message,
        color: flag ? '#CCCBFB' : '#EEEDFD',
        createdAt: new Date().getTime()
    };

    const history = getHistory();
    const lastMsg = JSON.stringify({ ...history[history.length - 1], createdAt: 0 });
    const newMsg = JSON.stringify({ ...msg, color: '#EEEDFD', createdAt: 0, type: 'message', room });

    if (history.length === 0 || newMsg !== lastMsg) {
        addHistory(msg, 'message', room);
    }

    return msg;
};

const generateLocationMessage = (username, room, url, flag) => {
    const msg = {
        username,
        url,
        color: flag ? '#CCCBFB' : '#EEEDFD',
        createdAt: new Date().getTime()
    };

    const history = getHistory();
    const lastMsg = JSON.stringify({ ...history[history.length - 1], createdAt: 0 });
    const newMsg = JSON.stringify({ ...msg, color: '#EEEDFD', createdAt: 0, type: 'locationMessage', room });

    if (history.length === 0 || newMsg !== lastMsg) {
        addHistory(msg, 'locationMessage', room);
    }

    return msg;
};

const generateFileMessage = (username, room, mimeType, fileName, ext, flag) => {
    const msg = {
        username,
        mimeType,
        fileName,
        ext,
        color: flag ? '#CCCBFB' : '#EEEDFD',
        createdAt: new Date().getTime()
    };

    const history = getHistory();
    const lastMsg = JSON.stringify({ ...history[history.length - 1], createdAt: 0 });
    const newMsg = JSON.stringify({ ...msg, color: '#EEEDFD', createdAt: 0, type: 'fileMessage', room });

    if (history.length === 0 || newMsg !== lastMsg) {
        addHistory(msg, 'fileMessage', room);
    }

    return msg;
};

const generateAudioMessage = (username, file, fileName, mimeType, ext, audioText, textId, flag) => {
    const msg = {
        username,
        file,
        mimeType,
        fileName,
        ext,
        audioText,
        textId,
        color: flag ? '#CCCBFB' : '#EEEDFD',
        createdAt: new Date().getTime()
    };

    return msg;
};

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateFileMessage,
    generateAudioMessage
};