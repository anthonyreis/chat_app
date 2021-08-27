const {getUser} = require('../utils/users');
const fs = require('fs');

const playVideo = (url, socket) => {
    const user = getUser(socket.id);

    fs.unlink(`./public/downloadMusic/${url}.webm`, () => 'ok');
    
    socket.broadcast.to(user.room).emit('playVideo', url);
    socket.emit('playVideo', url);

};

module.exports = playVideo;