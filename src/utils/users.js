const Filter = require('bad-words');

const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: 'Username and room are required'
        };
    }

    const filter = new Filter();

    if (filter.isProfane(username) || filter.isProfane(room)) {
        return {
            error: 'Profanity is not allowed'
        };
    }

    const existingUser = users.find((user) => user.room === room && user.username === username);

    if (existingUser) {
        return {
            error: 'Username is in use!'
        };
    }

    const user = { id, username, room };
    users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index != -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    const user = users.find((user) => user.id === id);

    return user;
};

const getUsersInRoom = (room) => {
    const roomUsers = users.filter((user) => user.room === room.toLowerCase());

    return roomUsers;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};