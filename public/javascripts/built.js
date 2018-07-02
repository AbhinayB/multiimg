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
    when('/views/multiupload', {
        templateUrl: '/views/multiupload',
        controller: 'Uploader'
    }).
    otherwise({
        redirectTo: '/views/auth'
    });
    // use the HTML5 History API
}]);;angular.module('awtapp')
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
    .controller('Uploader', ['$scope', '$http', '$mdToast', '$routeParams', function($scope, $http, $mdToast, $routeParams) {

        $scope.uploaderid = "first";
        $scope.uploaderid2 = "second";
        $scope.uploadurl1 = "/amazon/savefile";
        $scope.uploadurl2 = "/amazon/savefile";
        console.log("Uploader controller");
    }]);;angular.module('awtapp')
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
    }]);;angular.module('awtapp').directive('upload', function($http) {
    return {
        scope: true,
        restrict: 'E',
        transclude: true,
        scope: {
            uploadurl: '=',
            imginfo: '=',
            id: '='
        },
        templateUrl: '/html/imgupload.html',
        controller: "imguploader",
        link: function(scope, element, attrs, ctrls, transclude) {

        }
    };
}).controller('imguploader', ['$scope', '$http', '$mdToast', '$routeParams', '$mdDialog', function($scope, $http, $mdToast, $routeParams, $mdDialog) {
    $scope.selectedfiles = [];
    $scope.filestoUpload = [];
    $scope.selectFiles = function() {
        document.getElementById($scope.id).click();
    }
    $scope.filesChanged = function(event) {
        // console.log($scope.selectedfiles + $scope.selectedfiles.length);
        // console.log("filesChanged");
        // console.log("++++++++++++");
        // console.log(event.files);
        //event.preventDefault();
        var files = "";
        files = event.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.indexOf("image") !== -1) {
                previewFile(file);
            } else {
                console.log(file.name + " is not image");
            }
        }
        //console.log($scope.selectedfiles);
    }

    function previewFile(file) {
        var reader = new FileReader();
        reader.onload = function(data) {
            var src = data.target.result;
            var size = ((file.size / (1024 * 1024)) > 1) ? (file.size / (1024 * 1024)) + ' mB' : (file.size / 1024) + ' kB';
            var imgobj = {
                    'imgname': file.name,
                    'imgsize': size,
                    'imgtype': file.type,
                    'imgsrc': src,
                    'imgdata': file,
                    'imgprogress': "opacity:0.5",
                    'priority': 0,
                    'textdata': {}
                }
                //console.log(imgobj);
                // alert($scope.selectedfiles);
                // alert($scope.filestoUpload);
            $scope.unique = true;
            //console.log("here");
            //console.log($scope.selectedfiles);
            for (i = 0; i < $scope.selectedfiles.length; i++) {
                //console.log($scope.selectedfiles[i]);
                //console.log($scope.selectedfiles[i].imgprogress[opacity]);
                imgobj.imgprogress = $scope.selectedfiles[i].imgprogress;
                imgobj.isuploaded = $scope.selectedfiles[i].isuploaded;
                //imgobj.$$hashKey = $scope.selectedfiles[i].$$hashKey;
                // console.log(i);
                // console.log($scope.selectedfiles[i]);
                // console.log(imgobj);
                if (angular.equals($scope.selectedfiles[i], imgobj)) {
                    //console.log(i);
                    $scope.unique = false;
                }
                delete imgobj.isuploaded
                    //console.log($scope.unique);
            }
            // if ($scope.selectedfiles.length == 0) {
            //     imgobj.imgprogress = "opacity:0.5";
            // }



            $scope.$apply(function() {
                //alert($scope.unique);
                if ($scope.unique) {
                    //alert("bcoz unique is true ")
                    imgobj.imgprogress = "opacity:0.5";
                    $scope.selectedfiles.push(imgobj);
                    $scope.filestoUpload.push(imgobj);
                }


            });
            //$scope.isObjectExists(imgobj, function(exists) {
            //console.log("this is status.." + exists);
            //if (!exists) {
            //$scope.$apply(function() {
            //$scope.selectedfiles.push(imgobj);
            //$scope.filestoUpload.push(imgobj);
            // });
            //}
            //});
            // // if (!$scope.isObjectExists(imgobj)) {
            // //     console.log($scope.isObjectExists(imgobj));
            // //     $scope.$apply(function() {
            // //         $scope.selectedfiles.push(imgobj);
            // //         $scope.filestoUpload.push(imgobj);
            // //     });
            // }

            // console.log($scope.selectedfiles);
        }
        reader.readAsDataURL(file);
    }

    $scope.uploadFiles = function() {
            for (var i = 0; i < $scope.filestoUpload.length; i++) {
                uploadEachFile($scope.filestoUpload[i], $scope.uploadurl, function(e) {
                    if (e.lengthComputable) {
                        var progressBar = (e.loaded / e.total) * 100;
                        console.log(progressBar);
                    }
                    // console.log("Its Under Progress.....");
                });
            }
            $scope.filestoUpload = [];
        }
        //
    function uploadEachFile(file, rUrl, underProgress) {
        var fd = new FormData();
        fd.append('file', file.imgdata);
        $http.post(rUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },
            uploadEventHandlers: {
                progress: underProgress
            }
        }).then(function successCallback(response) {
            console.log("Success:" + response);
            var index = $scope.selectedfiles.indexOf(file);
            $scope.selectedfiles[index].imgprogress = "opacity:1";
            $scope.selectedfiles[index].isuploaded = true
        }, function errorCallback(response) {
            // console.log("Error:" + response);
        });
    }
    $scope.showDialog = function(ev, imagedata) {
        var parentEl = angular.element(document.body);
        console.log(imagedata);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: ev,
            clickOutsideToClose: true,
            template: '<md-dialog>' +
                '<md-toolbar><h3>{{items.imgname}}</h3></md-toolbar>' +
                '  <md-dialog-content>' +
                '<div style="height:30em"><img style="height:100%" src="{{items.imgsrc}}" /></div>' +
                '<div><md-input-container class="md-block" flex-gt-sm>' +
                '<label>Alt</label>' +
                '<input ng-model="reply.alttext">' +
                ' </md-input-container></div>' +
                '<div><md-input-container class="md-block" flex-gt-sm>' +
                '<label>Desc</label>' +
                '<input ng-model="reply.desctext">' +
                ' </md-input-container></div>' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button class="md-primary" ng-click="closeit()">' +
                '      Save' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
            locals: {
                items: imagedata
            },
            controller: ['$scope', 'items', function($scope, items) {
                $scope.items = items;
                $scope.reply = {
                    alttext: imagedata.textdata.alttext,
                    desctext: imagedata.textdata.desctext
                };
                $scope.closeit = function() {
                    $mdDialog.hide($scope.reply);
                };
            }]
        }).then(function(reply) {
            var index = $scope.selectedfiles.indexOf(imagedata);
            imagedata.textdata = reply;
            $scope.selectedfiles[index] = imagedata;
            $scope.filestoUpload.push(imagedata);
            imagedata.imgprogress = "opacity:0.5";
        }, function() {
            $scope.data = "";
        });
    }

    $scope.removeItem = function(ele) {
        var index = $scope.selectedfiles.indexOf(ele);
        $scope.selectedfiles.splice(index, 1);
        var index1 = $scope.filestoUpload.indexOf(ele);
        console.log(index1);
        if (index1 > -1) {
            $scope.filestoUpload.splice(index1, 1);
        }
        // console.log($scope.selectedfiles);
        // console.log($scope.filestoUpload);
        // console.log("item removed" + ele);
    }

    $scope.isObjectExists = function(obj, insertCallback) {
        var exists = false;
        var index = 0
        for (i = 0; i < $scope.selectedfiles.length; i++) {
            index = i;
            if (JSON.stringify($scope.selectedfiles[index]) === JSON.stringify(obj)) {
                exists = true;
            }
        }
        if (index == $scope.selectedfiles.length - 1)
            insertCallback(exists);
    }


}]);