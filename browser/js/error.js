function ErrorCtrl($scope, $rootScope) {
  $scope.error = '';

  $rootScope.$on('error', function(event, err) {
    $scope.error = err;
    try {
      $scope.$digest();
    } catch(err) {
      /// do nothing, as angular may be initializing
    }
  });
}