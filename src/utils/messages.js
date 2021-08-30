const { addHistory, getHistory } = require('./history');
const {getUserByName} = require('./users');

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
    let msg = {};
    const {id} = getUserByName(username, room);

    msg = {
        username,
        mimeType,
        fileName,
        ext,
        id,
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

const generateAudioMessage = (username, room, file, fileName, mimeType, ext, audioText, fileId, flag) => {
    const {id} = getUserByName(username, room);
    
    const msg = {
        username,
        file,
        mimeType,
        fileName,
        ext,
        audioText,
        id,
        fileId,
        color: flag ? '#CCCBFB' : '#EEEDFD',
        createdAt: new Date().getTime()
    };

    const history = getHistory();
    const lastMsg = JSON.stringify({ ...history[history.length - 1], createdAt: 0 });
    const newMsg = JSON.stringify({ ...msg, color: '#EEEDFD', createdAt: 0, type: 'audioMessage', room });

    if (history.length === 0 || newMsg !== lastMsg) {
        addHistory(msg, 'audioMessage', room);
    }

    return msg;
};

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateFileMessage,
    generateAudioMessage
};