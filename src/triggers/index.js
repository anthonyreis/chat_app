const sendMessage = require('./sendMessage');
const sendLocationMessage = require('./sendLocationMessage');
const sendFile = require('./sendFile');
const sendAudioMessage = require('./sendAudioMessage');
const join = require('./join');
const disconnect = require('./disconnect');
const playVideo = require('./playVideo');

module.exports = {
    sendMessage,
    sendLocationMessage,
    sendFile,
    join,
    disconnect,
    sendAudioMessage,
    playVideo
};