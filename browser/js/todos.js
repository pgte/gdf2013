function TodosCtrl($scope, websocket, $location) {
  $scope.newTodo = {};
  $scope.todos = [];

  websocket.connect($scope, function(server) {

    server.on('err', function(err) {
      $scope.error = err;
    });

    $scope.create =
    function create() {
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
      server.emit('remove', todo._id);
    };

    server.on('remove', function(todoId) {
      var found = -1;
      for(var i = 0; i < $scope.todos.length && found == -1; i++) {
        todo = $scope.todos[i];
        if (todo && todo._id == todoId) found = i;
      }
      if (found >= 0) {
        $scope.todos.splice(found, 1);
        $scope.$digest();
      }

    });


    /// Toggle and Update

    $scope.toggle =
    function toggle(todo) {
      console.log('toggle', todo.state);
      todo.state = todo.state == 'pending' ? 'done' : 'pending';
      console.log('toggle', todo.state);
      server.emit('update', todo);
    };

    server.on('update', function(_todo) {
      console.log('update:', _todo.state);
      var found = -1;
      for(var i = 0; i < $scope.todos.length && found == -1; i++) {
        todo = $scope.todos[i];
        if (todo && todo._id == _todo._id) found = i;
      }
      if (found >= 0) {
        $scope.todos[found] = _todo;
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


  /// Search and filter

  $scope.setSearch =
  function setSearch(state) {
    $location.search('state', state)
  };

  $scope.resetSearch =
  function resetSearch() {
    $scope.setSearch(null);
  };

  function captureStateFilter() {
    $scope.stateFilter = $location.search().state;
  }

  $scope.location = $location;
  $scope.$watch('location.search().state', captureStateFilter);


}