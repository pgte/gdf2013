var shoe = require('shoe');
var duplexEmitter = require('duplex-emitter');
var uuid = require('node-uuid');
var hub = require('./hub');

var todos = [];

function sort() {
  todos.sort(function(a, b) {
    return a.order - b.order;
  });
}

module.exports =
shoe(function(stream) {
  var client = duplexEmitter(stream);

  client.on('new', function(todo) {
    todo.state = 'pending';
    todo._id = uuid.v4();
    todo.order = Date.now();

    todos.push(todo);
    hub.emit('new', todo);
  });

  client.on('remove', function(todoId) {
    console.log('remove', todoId);
    var found = -1, todo, i;
    for(i = 0; i < todos.length && found == -1; i++) {
      todo = todos[i];
      if (todo._id == todoId) found = i;
    }
    if (found < 0) return client.emit('err', 'Couldn\'t find that todo item');
    
    todos.splice(found, 1);

    hub.emit('remove', todoId);
  });

  client.on('list', function() {
    hub.emit('list', todos);
  });

  client.on('update', function(_todo) {
    console.log('update:', _todo);
    var found = -1, todo, i;
    for(i = 0; i < todos.length && found == -1; i++) {
      todo = todos[i];
      if (todo._id == _todo._id) found = i;
    }
    if (found < 0) return client.emit('err', 'Couldn\'t find that todo item');
    todos[found] = _todo;

    sort();

    hub.emit('update', _todo);

  });

  hub.connect(client, stream);

});