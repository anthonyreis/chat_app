const {getUser} = require('../utils/users');
const fs = require('fs');

const playVideo = (url, socket, videoName) => {
    const user = getUser(socket.id);

    fs.unlink(`./public/downloadMusic/${url}.webm`, () => 'ok');
    fs.unlink(`./public/downloadMusic/${url}.m4a`, () => 'ok');
    
    socket.broadcast.to(user.room).emit('playVideo', url, videoName);
    socket.emit('playVideo', url, videoName);

};

module.exports = playVideo;