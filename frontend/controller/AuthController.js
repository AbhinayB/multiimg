angular.module('awtapp')
    .controller('AuthController', ['$scope', '$http', '$mdToast', function($scope, $http, $mdToast, Person) {
        $scope.person = {
                id: "AKIAJVVCIAMH46Y6EWRQ",
                key: "v/bcNHiZwlPJyeAR+GGmFHZ2VL4ft3KOFC6O+SyG"
            }
            //Person.id = $scope.person.id; 
            //Person.key = $scope.person.key;  
        $scope.validate = function(person) {
            persondata = person;
            $http.post('/amazon/validate', person, null).then(function successCallback(response) {
                if (response.data) {
                    $mdToast.show({
                        hideDelay: 5000,
                        position: 'top right',
                        controller: 'ToastCtrl',
                        templateUrl: '/views/toasttemp',
                        locals: { data: response.data }
                    });
                    $scope.data = response.data;
                    items_fetched = true;
                    console.log($scope.data);
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Please Enter Valid Details')
                        .position('top right')
                        .hideDelay(5000)
                    );
                    $scope.data = {};
                }
            }, function errorCallback(err) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(err.message)
                    .position('top right')
                    .hideDelay(5000)
                );
                $scope.data = {};
                console.log("Error in server Please contact. " + err);
            });
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
        $location.url('/views/bucketlist');

    };
});