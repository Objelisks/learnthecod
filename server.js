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

    // messages are only used for the chat window
    socket.on('message', function(data) {
        // add the client id to the message and pass on to everyone else
        data.from = socket.id;
        socket.broadcast.emit('message', data);
    });

    // individual keys are sent for the code window
    socket.on('key', function(data) {
        socket.broadcast.emit('key', data);
    });
});