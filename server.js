var io = require('socket.io').listen(80);

// something something serve web page also

io.on('connected', function(socket) {
    // something something namepspaces

    socket.on('keypress', function(data) {
        socket.broadcast.emit('keypress', data);
    });
});
