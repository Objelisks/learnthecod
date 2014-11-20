var socket = io();

var appendToChat = function(str) {
    var chatWindow = document.querySelector('#chat');
    chatWindow.textContent += str;
};

socket.on('connect', function() {
    socket.on('key', appendToChat);
});

document.addEventListener('keypress', function(e) {
    e.preventDefault();

    var key = e.keyCode;
    var character = String.fromCharCode(key);
    if(character !== "") {
        socket.emit('key', character);
        appendToChat(character);
    }
});