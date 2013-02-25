function TodosCtrl($scope, websocket) {
  $scope.newTodo = {};
  $scope.todos = [];

  websocket.connect($scope, function(server) {

    $scope.create =
    function create() {
      console.log('create todo', $scope.newTodo);
      server.emit('new', $scope.newTodo);
      $scope.newTodo = {};
    };

    server.on('new', function(todo) {
      console.log('new todo', todo);
      $scope.todos.push(todo);
      $scope.$digest();
    });

  });

}