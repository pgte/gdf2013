var EventEmitter = require('events').EventEmitter;
var propagate = require('propagate');

var hub =
module.exports =
new EventEmitter();

var clients = [];

hub.connect =
function connect(client, stream) {
  client.__oldEmit = client.emit;

  /// Forward all events happening on the client on to the hub
  var p = propagate(client, hub);

  /// Forward all events happening on the hub to the client
  clients.push(client);

  /// Once the stream end, remove this client from the hub
  stream.once('end', function() {
    // stop propagating events from the client into the hub
    p.end();

    // stop propagating events from the hub into the client
    var index = clients.indexOf(client);
    if (index >= -1) clients.splice(index, 1);

    client.emit = client.__oldEmit;
    delete client.__oldEmit;
  });
};

hub.emit =
function emit() {
  var args = arguments;
  clients.forEach(function(client) {
    client.__oldEmit.apply(client, args);
  });
};