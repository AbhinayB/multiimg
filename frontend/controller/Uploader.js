angular.module('awtapp')
    .controller('Uploader', ['$scope', '$http', '$mdToast', '$routeParams', function($scope, $http, $mdToast, $routeParams) {

        $scope.uploaderid = "first";
        $scope.uploaderid2 = "second";
        $scope.uploadurl1 = "/amazon/savefile";
        $scope.uploadurl2 = "/amazon/savefile";
        console.log("Uploader controller");
    }]);