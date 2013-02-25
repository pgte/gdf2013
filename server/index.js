/// Create server

var server = require('http').createServer();


/// Serve static files

var ecstatic = require('ecstatic');
var serveStatic = ecstatic(__dirname + '/../browser');

server.on('request', serveStatic);


/// Websockets

var websocketServer = require('./websocket');
websocketServer.install(server, '/websocket');

/// Listen

var port = 8081;
server.listen(port, function() {
  console.log('HTTP server listening on port %d', port);
});