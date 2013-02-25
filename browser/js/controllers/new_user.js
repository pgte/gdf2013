function NewUserCtrl($scope, $location) {
  $scope.user = {};
  $scope.messages.title = 'Signup';

  $scope.create = function() {
    $scope.tried = true;
    $scope.clearError();
    $scope.post('/user', $scope.user, function() {
      $location.url('/user/welcome');
    });
  };
}

window.NewUserCtrl = NewUserCtrl;