let history = [];

const addHistory = (info, type, room) => {
    history.push({ ...info, type, room });
};

const getHistory = () => history;

const eraseHistory = (room) => {
    history = history.map((info) => info.room !== room.toLowerCase());
};

module.exports = {
    addHistory,
    getHistory,
    eraseHistory
};