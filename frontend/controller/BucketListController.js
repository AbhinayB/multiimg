(function() { //
    var items_fetched = false;

    angular.module('awtapp')
        .controller('BucketListController', ['$scope', '$http', '$mdToast', '$location', function($scope, $http, $mdToast, $location) {

            $http.get('/amazon/list-bucket').then(function successCallback(response) {
                //list of buckets
                if (response && response.data) {
                    $scope.bucketList = response.data;
                }

            }, function errorCallback(err) {
                console.log("Error in server Please contact. " + err);
            });

            $scope.showSimpleToast = function(msg) {
                console.log(msg);
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('top right')
                    .hideDelay(3000)
                );
            };
            $scope.deleteBucket = function(bucketNameArgu) {
                var obj = {
                    bucketName: bucketNameArgu,
                }
                $http.post('/amazon/deleteBucket', obj)
                    .then(
                        function successCallback(response) {
                            $scope.showSimpleToast(response.data.message)
                            setInterval(
                                function() {
                                    window.location.reload(true);
                                }, 3000);
                        },
                        function errCallback(err) {
                            $scope.showSimpleToast(response.data.message)
                            console.log(err);
                        }
                    );
            }

            $scope.gotoState = function(viewName, bucketName) {
                $location.url('/views/' + viewName + '/' + bucketName);
                // $http.get('/views/' + viewName + '/' + bucketName).then(
                //     function successCallback(response) {
                //         console.log(response);
                //     },
                //     function errCallback(err) {
                //         $scope.showSimpleToast(response.data.message)
                //         console.log(err);
                //     }
                // );
            }
        }])



    .controller('ToastCtrl', function($location, $scope, $mdToast, $mdDialog, data) {
        isDlgOpen = false;
        $scope.closeToast = function() {
            if (isDlgOpen) return;

            $mdToast
                .hide()
                .then(function() {
                    isDlgOpen = false;
                });
        };

        $scope.openBuckets = function(e) {
            $scope.items_fetched = items_fetched;
            $location.path("/bucketlist");

        };
    });
})();