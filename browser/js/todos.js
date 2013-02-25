function TodosCtrl($scope, websocket) {
  $scope.newTodo = {};
  $scope.todos = [];

  websocket.connect($scope, function(server) {

    server.on('err', function(err) {
      $scope.error = err;
    });

    $scope.create =
    function create() {
      console.log('create todo', $scope.newTodo);
      server.emit('new', $scope.newTodo);
      $scope.newTodo = {};
    };

    server.on('new', function(todo) {
      $scope.todos.push(todo);
      $scope.$digest();
    });


    /// Remove

    $scope.remove =
    function remove(todo) {
      console.log('removing', todo);
      server.emit('remove', todo._id);
    };

    server.on('remove', function(todoId) {
      console.log('server told me to remove', todoId);
      var found = -1;
      for(var i = 0; i < $scope.todos.length && found == -1; i++) {
        todo = $scope.todos[i];
        if (todo && todo._id == todoId) found = i;
      }
      console.log('found:', found);
      if (found >= 0) {
        $scope.todos.splice(found, 1);
        $scope.$digest();
      }

    });


    /// List

    server.on('list', function(todos) {
      $scope.todos = todos;
      $scope.$digest();
    });

    /// Request the todo list now
    server.emit('list');

  });

}