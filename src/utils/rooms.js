const rooms = [];

const addRoom = (room) => {
    const newRoom = rooms.find((roomName) => roomName === room);

    if (!newRoom) {
        rooms.push(room);
    }
};

const removeRoom = (room) => {
    const idRoom = rooms.findIndex((roomName) => roomName === room);

    if (idRoom != -1) {
        return rooms.splice(idRoom, 1)[0];
    }
};

const getRooms = () => rooms;

module.exports = {
    addRoom,
    removeRoom,
    getRooms
};