const {getUser} = require('../utils/users');

const playVideo = (url, socket) => {
    const user = getUser(socket.id);
    
    socket.broadcast.to(user.room).emit('playVideo', url);
    socket.emit('playVideo', url);

};

module.exports = playVideo;