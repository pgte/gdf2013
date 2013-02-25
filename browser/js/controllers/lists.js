function byOrder(a, b) {
  return a.order - b.order;
}

function ListsCtrl($scope, websocket) {

  $scope.newlist = {};
  $scope.lists = [];

  function findList(list) {
    for(var i = 0; i < $scope.lists.length; i++) {
      if (list._id == $scope.lists[i]._id) return i;
    }
    return -1;
  }



  websocket.connect($scope, function(err, server) {
    if (err) return $scope.emitError(err);

    server.on('err', $scope.emitError.bind($scope));

    var serverLists = server.box('lists');

    // ask for serverLists
    serverLists.emit('index');

    // get serverLists
    serverLists.on('index', function(lists) {
      $scope.lists = lists;
      $scope.$digest();
    });

    // Create list
    $scope.create = function() {
      serverLists.emit('new', $scope.newlist);
      $scope.newlist = {};
    };

    // server sends new list
    serverLists.on('new', function(list) {
      $scope.lists.push(list);
      $scope.$digest();
    });

    // Remove list
    $scope.remove = function(list) {
      serverLists.emit('remove', list._id);
    };

    serverLists.on('remove', function(list) {
      var index = findList(list);
      if (index >= 0) {
        $scope.lists.splice(index, 1);
        $scope.$digest();
      }
    });

    // Server sends an update for the todo item
    serverLists.on('update', function(list) {
      var oneList;
      var index = findList(list);
      if (index >= 0) {
        $scope.lists[index] = list;
        
        // sort the todo items by order
        $scope.lists = $scope.lists.sort(byOrder);
        $scope.$digest();
      }
    });


    /// ------- Drag And Drop -------

    $scope.dragStart = function(item) {
      return item;
    };
    
    $scope.dropAccept = function(item, target) {
      return item._id != target._id;
    };

    $scope.dropCommit = function(item, target) {

      // Reorder the todo item
      var targetPlace = $scope.lists.indexOf(target);

      // Shift all the next by 2
      var list;
      for(var i = targetPlace; i < $scope.lists.length; i++) {
        list = $scope.lists[i];
        if (list._id != item._id) {
          list.order += 2;
          serverLists.emit('update', list);        
        }
      }
      
      // calculate order of dropped item
      item.order = target.order - 1;

      // save to the server
      serverLists.emit('update', item);
    };


  })
}

window.ListsCtrl = ListsCtrl;