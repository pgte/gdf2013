require('./app');

var reconnect = require('reconnect/shoe');
var duplexEmitter = require('duplex-emitter');

angular.module('ToodooApp').
  factory('websocket', function() {
    function connect(scope, callback) {
      var r;
      
      r = reconnect(function(stream) {

        scope.$on('$destroy', function() {
          r.reconnect = false;
          stream.end();
        });

        var server = duplexEmitter(stream);

        callback(server);

      }).connect('/websocket');
    }

    return {
      connect: connect
    };
  });