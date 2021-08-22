let history = [];

const addHistory = (info, type, room) => {
    const {username, message} = info;
    
    if (username === 'Admin' && message === 'Welcome!') {
        return null;
    }

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