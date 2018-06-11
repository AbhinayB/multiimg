angular.module('awtapp', ['ngAria', 'ngRoute', 'ngMaterial', 'ngMessages']).config(['$routeProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/views/bucketlist', {
        templateUrl: '/views/bucketlist',
        controller: 'BucketListController'
    }).
    when('/views/listObjects/:paramObj', {
        templateUrl: '/views/listObjects',
        controller: 'ObjectList'
    }).
    when('/views/auth', {
        templateUrl: '/views/auth',
        controller: 'AuthController'
    }).
    when('/views/createBucket', {
        templateUrl: '/views/createBucket',
        controller: 'createBucket'
    }).
    when('/views/FiletoBucket', {
        templateUrl: '/views/FiletoBucket',
        controller: 'FiletoBucket'
    }).

    otherwise({
        redirectTo: '/views/auth'
    });
    // use the HTML5 History API
}]);