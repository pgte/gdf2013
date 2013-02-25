function prop(prop) {
  return function(o) {
    return o[prop];
  };
}

function ShareCtrl($scope, $routeParams, websocket) {
  $scope.newSharedWith = {};
  // $scope.list is inherited from parent scope
  
  websocket.connect($scope, function(err, server) {

    // Error handling
    if (err) return $scope.emitError(err);
    server.on('err', $scope.emitError.bind($scope));

    // Server lists::* scope
    var serverLists = server.box('lists');

    // View actions
    $scope.create = function create() {
      if ($scope.list) {
        $scope.list.sharedWith.push($scope.newSharedWith.email);
        $scope.newSharedWith = {};
        serverLists.emit('update', $scope.list);
      }
    };

    $scope.remove = function remove(email) {
      var index = $scope.list.sharedWith.indexOf(email);
      if (index >= 0) {
        $scope.list.sharedWith.splice(index, 1);
        serverLists.emit('update', $scope.list);
      }
    }

    // Interact with server    

    var listId = $routeParams.listId;
    serverLists.emit('get', listId);

    // Server sends us the updated list document
    serverLists.on('update', function(list) {
      $scope.list = list;
      if (! $scope.list.sharedWith) $scope.list.sharedWith = [];      
      $scope.$digest();
    });

  });
  
}

window.ShareCtrl = ShareCtrl;