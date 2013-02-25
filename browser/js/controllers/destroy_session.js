function DestroySessionCtrl($scope) {
  $scope.post('/session/destroy', {}, function() {
    window.location = '/';
  });
}

window.DestroySessionCtrl = DestroySessionCtrl;