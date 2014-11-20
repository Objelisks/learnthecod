var http = require('http');
var socketio = require('socket.io');
var nodeStatic = require('node-static');

var port = process.argv[2] || 80;
var files = new nodeStatic.Server('./public');

var server = http.createServer(function(req, res) {
    req.addListener('end', function() {
        files.serve(req, res);
    }).resume();
});
server.listen(port);

var io = socketio(server);
io.on('connection', function(socket) {
    // something something namespaces

    socket.on('key', function(data) {
        socket.broadcast.emit('key', data);
    });
});