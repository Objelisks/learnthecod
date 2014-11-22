var socket = io();

var ENTER = 13, BACKSPACE = 8, TAB = 9;
var specialKeys = [ENTER, BACKSPACE, TAB];
var message = "";
var userName = "Tim"; // get from dialog box
var activeHandler;
var chatElement = document.querySelector('#chat'),
    codeElement = document.querySelector('#code'),
    lineoutElement = document.querySelector('#lineout'),
    consoleElement = document.querySelector('#console');
var currentChatLine = document.createElement('div');
chatElement.appendChild(currentChatLine);


var evaluateCode = function(code) {
    var worker = new Worker('worker.js');
    worker.postMessage(code);
    worker.onmessage = function(e) {
        var obj = e.data;
        switch(obj.type) {
            case 'line':
                var resultDiv = document.createElement('div');
                resultDiv.textContent = '' + obj.data;
                lineoutElement.appendChild(resultDiv);
                break;
            case 'console':
                var resultDiv = document.createElement('div');
                resultDiv.textContent = '' + obj.data;
                consoleElement.appendChild(resultDiv);
                break;
            default:
                break;
        }
    };
};
evaluateCode('console.log("hello world"); 15 * 28 + 4;');

// <div><span class="chatName">name: </span><span>text</span></div>
var buildChatLine = function(name, text) {
    var lineElement = document.createElement('div');
    var nameElement = document.createElement('span');
    nameElement.classList.add('chatName');
    nameElement.textContent = name + ": ";
    var textElement = document.createElement('span');
    textElement.textContent = text;
    lineElement.appendChild(nameElement);
    lineElement.appendChild(textElement);
    return lineElement;
};

var sendMessage = function() {
    socket.emit('message', { 'text': message, 'name': userName });
    var newLine = buildChatLine(userName, message);
    chatElement.insertBefore(newLine, currentChatLine);
    message = "";
    currentChatLine.textContent = message;
};

var getUserColor = function(id) {
    var userColor = userColors[id];
    if(userColor === undefined) {
        userColor = userColors[id] = generateColor();
    }
};

var generateColor = function() {
    return '#aa3333';
};


var chatHandleKeyDown = function(key) {
    if(specialKeys.indexOf(key) !== -1) {
        switch(key) {
            case ENTER:
                // enter key pressed
                sendMessage();
                return true;
            case BACKSPACE:
                // backspace key pressed
                message = message.slice(0, -1);
                currentChatLine.textContent = message;
                return true;
            case TAB:
                return true;
            default:
                break;
        }
    }
    return false;
};

var chatHandleKeyPress = function(key) {
    var character = String.fromCharCode(key);
    if(character !== "") {
        message += character;
        currentChatLine.textContent = message;
    }
};

var chatHandler = {
    'keydown' : chatHandleKeyDown,
    'keypress' : chatHandleKeyPress
};


var codeHandleKeyDown = function(key) {
    if(specialKeys.indexOf(key) !== -1) {
        switch(key) {
            case ENTER: 
                // enter key pressed
                codeElement.textContent += '\n';
                return true;
            case BACKSPACE:
                // backspace key pressed
                codeElement.textContent = codeElement.textContent.slice(0, -1);
                return true;
            case TAB:
                codeElement.textContent += '    ';
                return true;
            default:
                break;
        }
    }
    return false;
}

var codeHandleKeyPress = function(key) {
    var character = String.fromCharCode(key);
    if(character !== "") {
        socket.emit('key', character);
        codeElement.textContent += character;
    }
};

var codeHandler = {
    'keydown' : codeHandleKeyDown,
    'keypress' : codeHandleKeyPress
};

activeHandler = chatHandler;


socket.on('connect', function() {
    socket.on('message', function(data) {
        //appendToChat(data.text, getUserColor(data.from));
    });
    //socket.on('key', appendToCode);
});

document.addEventListener('keydown', function(e) {
    if(activeHandler.keydown(e.keyCode)) {
        e.preventDefault();
    }
})

document.addEventListener('keypress', function(e) {
    e.preventDefault();

    var key = e.keyCode;
    activeHandler.keypress(key);
});

chatElement.addEventListener('mouseenter', function(e) {
    activeHandler = chatHandler;
    chatElement.classList.add('active');
    codeElement.classList.remove('active');
});
document.querySelector('#center').addEventListener('mouseenter', function(e) {
    activeHandler = codeHandler;
    codeElement.classList.add('active');
    chatElement.classList.remove('active');
});