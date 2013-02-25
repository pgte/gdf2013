function TooDooCtrl($scope, $http) {

  /// ----- Default values

  $scope.messages = {title : 'The to-do list app'};

  /// ----- Error Management

  $scope.clearError = function clearError() {
    $scope.error = '';
  };

  $scope.emitError = function(err) {
    $scope.error = err.message || err;
    $scope.$digest();
  }


  /// ----- HTTP

  function httpError(data, status, headers) {

    console.log('Error:', arguments);

    $scope.submitting = false;

    // Have a default error:    
    var error = 'An error occurred. The browser may have lost communication with the server.';
    
    // Try to extract as much info as we can from returned data
    if (data) {
      if (typeof data == 'string') {
        try { data = JSON.parse(data); } catch(err) {}
      }
      error = data.error && data.error.message || data;
    }
    if (status) error = error + ' (' + status + ')';
    
    $scope.emitError(error);
  }

  $scope.post = function(url, data, callback) {
    $scope.submitting = true;

    $http.post(url, angular.toJson(data)).
      success(function() {
        $scope.submitting = false;
        callback();
      }).
      error(httpError);
  }
}

window.TooDooCtrl = TooDooCtrl;