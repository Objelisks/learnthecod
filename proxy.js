var http = require('http');
var httpProxy = require('http-proxy');
var port = process.env.PORT || 3000;
var proxyOptions = {
    target: {
        'host': 'localhost',
        'port': port
    }
};

var proxy = httpProxy.createProxyServer(proxyOptions);

var proxyServer = http.createServer(function(req, res) {
    proxy.web(req, res);
});

proxyServer.on('upgrade', function(req, socket, head) {
    proxy.ws(req, socket, head);
});

proxyServer.listen(80);