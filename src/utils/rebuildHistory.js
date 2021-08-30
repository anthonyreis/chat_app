const { getHistory } = require('./history');

const rebuildHistory = (username, room, socket) => {
    const history = getHistory();

    history.map((info) => {
        if (info.room === room.toLowerCase()) {
            if (info.type === 'message') {
                socket.emit('message', info);
            } else if (info.type === 'locationMessage') {
                socket.emit('locationMessage', info);
            } else if (info.type === 'fileMessage') {
                socket.emit('fileMessage', info);
            } else {
                socket.emit('audioMessage', info);
            }
        }
    });
};

module.exports = rebuildHistory;