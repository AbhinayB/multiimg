angular.module('awtapp')
    .controller('ObjectList', ['$scope', '$http', '$mdToast', '$routeParams', function($scope, $http, $mdToast, $routeParams) {

        var bucket = $routeParams.paramObj;
        $scope.buck = bucket;
        $scope.deleteobject = function(key) {
            $http.post('/amazon/deleteobject', { bucket: bucket, key: key }).then(function successCallback(response) {
                console.log(response);
                setInterval(
                    function() {
                        window.location.reload(true);
                    }, 1000);
            }, function errorCallback(err) {
                console.log("Error in server Please contact. " + err);
            });
        }
        $http.post('/amazon/bucketobjects', { bucket: bucket }).then(function successCallback(response) {
            console.log(response);
            if (response && response.data) {
                $scope.objectList = response.data;
            }

        }, function errorCallback(err) {
            console.log("Error in server Please contact. " + err);
        });

        // $scope.showSimpleToast = function(msg) {
        //     console.log(msg);
        //     $mdToast.show(
        //         $mdToast.simple()
        //         .textContent(msg)
        //         .position('top right')
        //         .hideDelay(3000)
        //     );
        // };
        // $scope.deleteObject = function(objectname) {
        //     var obj = {
        //         object: objectname,
        //     }
        //     $http.post('/amazon/deleteObject', obj)
        //         .then(
        //             function successCallback(response) {
        //                 $scope.showSimpleToast(response.data.message)
        //                 setInterval(
        //                     function() {
        //                         window.location.reload(true);
        //                     }, 3000);
        //             },
        //             function errCallback(err) {
        //                 $scope.showSimpleToast(response.data.message)
        //                 console.log(err);
        //             }
        //         );
        // }



    }])