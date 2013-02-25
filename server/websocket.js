var shoe = require('shoe');
var duplexEmitter = require('duplex-emitter');

var todos = [];

module.exports =
shoe(function(stream) {
  var client = duplexEmitter(stream);

  client.on('new', function(todo) {
    todos.push(todo);
    client.emit('new', todo);
  });

});