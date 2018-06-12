angular.module('awtapp')
    .controller('Uploader', ['$scope', '$http', '$mdToast', '$routeParams', function($scope, $http, $mdToast, $routeParams) {

        $scope.uploaderid = "first";
        console.log("Uploader controller");
    }]);