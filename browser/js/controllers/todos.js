/// ---- Utilities

function byOrder(a, b) {
  return a.order - b.order;
}

/// ----- /todos <-- Todos Controller

function TodosCtrl($scope, $location, $routeParams, websocket) {
  $scope.newtodo = {};
  $scope.todos = [];
  $scope.stateFilter = '';

  function findTodo(todo) {
    for(var i = 0; i < $scope.todos.length; i++) {
      if (todo._id == $scope.todos[i]._id) return i;
    }
    return -1;
  }

  websocket.connect($scope, function(err, server) {

    if (err) return $scope.emitError(err);
    server.on('err', $scope.emitError.bind($scope));

    var serverTodos = server.box('todos');

    $scope.create = function() {
      // save the todo item
      serverTodos.emit('new', $scope.list._id, $scope.newtodo);
      $scope.newtodo = {};
    };

    $scope.toggle = function(todo) {
      todo.state = todo.state == 'pending' ? 'done' : 'pending';
      serverTodos.emit('update', todo);
    };

    $scope.remove = function(todo) {
      serverTodos.emit('remove', todo._id);
    };

    /// Server API

    serverLists = server.box('lists');

    // Get List ID from route
    var listId = $routeParams.listId;

    // Ask for list document
    serverLists.emit('get', listId);

    // Server sends list document
    serverLists.on('update', function(list) {
      $scope.list = list;

      // Ask for todo list
      serverTodos.emit('index', listId);
    });

    // Server sends the new todo list
    serverTodos.on('index', function(listId, todos) {
      if ($scope.list && listId != $scope.list._id) return;
      $scope.todos = todos;
      $scope.$digest();
    });

    // Server sends a new todo item
    serverTodos.on('new', function(todo) {
      // Check if this new todo belongs to current list
      if (! $scope.list || $scope.list._id != todo.list) return;
      $scope.todos.push(todo);
      $scope.$digest();
    });

    // Server sends an update for the todo item
    serverTodos.on('update', function(todo) {
      var index = findTodo(todo);
      if (index >= 0) {
        $scope.todos[index] = todo;
        // sort the todo items by order
        $scope.todos = $scope.todos.sort(byOrder);
        $scope.$digest();
      }
    });

    // Server removes a todo item
    serverTodos.on('remove', function(todo) {
      var index = findTodo(todo);
      if (index >= 0) {
        $scope.todos.splice(index, 1);
        $scope.$digest();
      }
    });

    
    /// ---- Search and filter

    $scope.resetSearch = function() {
      $scope.setSearch(null);
    };

    $scope.setSearch = function(state) {
      $location.search('state', state);
    };

    function captureStateFilter() {
      $scope.stateFilter = $location.search().state;
    }

    $scope.location = $location;
    $scope.$watch('location.search().state', captureStateFilter);


    /// ---- Drag And Drop Reordering

    
    $scope.dragStart = function(item) {
      return item;
    };


    $scope.dropAccept = function(item, target) {
      // Don't let drop happen when we are filtering
      return ! $scope.stateFilter && item._id != target._id;
    };

    $scope.dropCommit = function(item, target) {

      // Reorder the todo item
      var targetPlace = $scope.todos.indexOf(target);

      // Shift all the next by 2
      var todo;
      for(var i = targetPlace; i < $scope.todos.length; i++) {
        todo = $scope.todos[i];
        if (todo._id != item._id) {
          todo.order += 2;
          serverTodos.emit('update', todo);        
        }
      }
      
      // calculate order of dropped item
      item.order = target.order - 1;

      // save to the server
      serverTodos.emit('update', item);
    };

  

  });

}

global.TodosCtrl = TodosCtrl;