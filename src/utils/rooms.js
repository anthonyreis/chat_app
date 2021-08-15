const rooms = [];

const addRoom = (room, password) => {
    const roomExists = rooms.find((roomName) => roomName.room === room);

    if (!roomExists) {
        const newRoom = {
            room,
            password
        };
        rooms.push(newRoom);
    }
};

const removeRoom = (room) => {
    const idRoom = rooms.findIndex((roomName) => roomName === room);

    if (idRoom != -1) {
        return rooms.splice(idRoom, 1)[0];
    }
};

const getRoom = (room) => {
    const roomExists = rooms.find((roomName) => roomName.room === room.toLowerCase());

    if (roomExists) {
        return roomExists;
    }
};

const getRooms = () => rooms;

module.exports = {
    addRoom,
    removeRoom,
    getRooms,
    getRoom
};