angular.module('awtapp')
    .controller('createBucket', ['$scope', '$http', '$mdToast', '$routeParams', function($scope, $http, $mdToast, $routeParams) {
        $scope.bucketname = "";
        $scope.createbucket = function() {
            $http.post('/amazon/createBucket', { bucket: $scope.bucketname }).then(function successCallback(response) {
                if (response.data) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Bucket created Successfully")
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Failed to create bucket")
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
                setInterval(
                    function() {
                        window.location.reload(true);
                    }, 2000);
            }, function errorCallback(err) {
                console.log("Error in server Please contact. " + err);
            });
        }
    }]);