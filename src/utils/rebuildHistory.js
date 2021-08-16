const { getHistory } = require('./history');

const rebuildHistory = (username, room, socket) => {
    const history = getHistory();

    history.map((info) => {
        if (info.room === room.toLowerCase()) {
            if (info.type === 'message') {
                socket.emit('message', info);
            } else if (info.type === 'locationMessage') {
                socket.emit('locationMessage', info);
            } else {
                socket.emit('fileMessage', info);
            }
        }
    });
};

module.exports = rebuildHistory;