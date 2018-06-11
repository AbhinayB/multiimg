angular.module('awtapp')
    .controller('MyController', ['$scope', '$http', '$mdToast', '$location', '$mdSidenav', '$window', function($scope, $http, $mdToast, $location, $window) {

        $scope.gotoView = function(viewName) {
            $location.url('/views/' + viewName)
                // window.location.href($window.location.origin + '/' + viewName);
        }

    }]);
/*angular.module('awtapp').factory('Person', function() {
    return { id: '', key: '' };
});*/