function ErrorCtrl($scope, $rootScope) {
  $scope.error = '';

  $rootScope.$on('error', function(event, err) {
    $scope.error = err;
    $scope.$digest();
  });
}