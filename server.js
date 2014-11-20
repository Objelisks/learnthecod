var http = require('http');
var socketio = require('socket.io');
var nodeStatic = require('node-static');

var port = process.env.PORT || 3000;
var files = new nodeStatic.Server('./public');


var server = http.createServer(function(req, res) {
    req.addListener('end', function() {
        files.serve(req, res);
    }).resume();
}).listen(port);

var io = socketio(server);
io.on('connected', function(socket) {
    // something something namespaces

    socket.on('keypress', function(data) {
        socket.broadcast.emit('keypress', data);
    });
});