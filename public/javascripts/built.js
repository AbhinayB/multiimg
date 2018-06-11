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
}]);;angular.module('awtapp')
    .controller('AuthController', ['$scope', '$http', '$mdToast', function($scope, $http, $mdToast, Person) {
        $scope.person = {
                id: "AKIAID3JGOUPCPUKDC5Q",
                key: "SU+2Va36E2QP80F8whIMuURBTdUGt5TXOzcZ2mDP"
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
});;(function() { //
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
})();;angular.module('awtapp')
    .controller('FiletoBucket', ['$scope', '$http', '$mdToast', '$routeParams', function($scope, $http, $mdToast, $routeParams) {

        $scope.uploadFileToUrl = function() {
            console.log("sdfhfdffddf");
            var fd = new FormData();
            fd.append('file', $scope.file);
            fd.append('filename', $scope.fileName);
            $http.post("/amazon/deleteobject", fd, {
                    withCredentials: false,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function(response) {
                    var data = response.data;
                    var status = response.status;
                    console.log(data);

                    if (status == 200 || status == 202) {} else
                        console.log("error");
                })
                .catch(function(error) {
                    console.log(error.status);
                });
        }
    }]).directive('chooseFile', function() {
        return {
            link: function(scope, elem, attrs) {
                var button = elem.find('button');
                var input = angular.element(elem[0].querySelector('input#fileInput'));
                button.bind('click', function() {
                    input[0].click();
                });
                input.bind('change', function(e) {
                    scope.$apply(function() {
                        var files = e.target.files;
                        if (files[0]) {
                            scope.fileName = files[0].name;
                            scope.file = files[0];
                        } else {
                            scope.fileName = null;
                        }
                    });
                });
            }
        };
    });;angular.module('awtapp')
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



    }]);angular.module('awtapp')
    .controller('MyController', ['$scope', '$http', '$mdToast', '$location', '$mdSidenav', '$window', function($scope, $http, $mdToast, $location, $window) {

        $scope.gotoView = function(viewName) {
            $location.url('/views/' + viewName)
                // window.location.href($window.location.origin + '/' + viewName);
        }

    }]);
/*angular.module('awtapp').factory('Person', function() {
    return { id: '', key: '' };
});*/;angular.module('awtapp')
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