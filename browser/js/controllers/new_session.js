function NewSessionCtrl($scope, $location) {
  $scope.credentials = {};
  $scope.messages.title = 'Log in'

  $scope.create = function() {
    $scope.tried = true;
    $scope.clearError();
    $scope.post('/session', $scope.credentials, function() {
      var backTo = $location.search().back_to || '/lists';
      window.location = backTo;
    });
  };
}

window.NewSessionCtrl = NewSessionCtrl;