angular.module('awtapp').directive('upload', function($http) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            alttext: '=info',
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
        console.log(event.files);
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
                    alttext: "",
                    desctext: ""
                };
                $scope.closeit = function() {
                    console.log(JSON.stringify($scope.reply));
                    $mdDialog.hide($scope.reply);
                };
            }]
        }).then(function(reply) {
            var index = $scope.selectedfiles.indexOf(imagedata);
            imagedata.textdata = reply;
            $scope.selectedfiles[index] = imagedata;
            $scope.filestoUpload.push(imagedata);
            imagedata.imgprogress = "opacity:0.5";
            // console.log($scope.selectedfiles);
            // console.log("-----" + JSON.stringify(reply));
        }, function() {
            $scope.data = "";
        });
    }

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
        }, function errorCallback(response) {
            console.log("Error:" + response);
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
            console.log($scope.selectedfiles);
            console.log($scope.filestoUpload);
            console.log("item removed" + ele);
        }
        // $scope.showAdvanced = function(ev) {
        //     $mdDialog.show({
        //             controller: DialogController,
        //             templateUrl: 'dialog1.tmpl.html',
        //             parent: angular.element(document.body),
        //             targetEvent: ev,
        //             clickOutsideToClose: true,
        //             fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        //         })
        //         .then(function(answer) {
        //             $scope.status = 'You said the information was "' + answer + '".';
        //         }, function() {
        //             $scope.status = 'You cancelled the dialog.';
        //         });
        // };
    $scope.uploadFiles = function() {
        for (var i = 0; i < $scope.filestoUpload.length; i++) {
            uploadEachFile($scope.filestoUpload[i], "/amazon/savefile", function(e) {
                if (e.lengthComputable) {
                    var progressBar = (e.loaded / e.total) * 100;
                    console.log(progressBar);
                }
                console.log("Its Under Progress.....");
            });
        }
        $scope.filestoUpload = [];
    }

    function previewFile(file) {
        var reader = new FileReader();
        reader.onload = function(data) {
            var src = data.target.result;
            var size = ((file.size / (1024 * 1024)) > 1) ? (file.size / (1024 * 1024)) + ' mB' : (file.size / 1024) + ' kB';
            $scope.$apply(function() {
                if (!$scope.selectedfiles.some(item => item.imgname === file.name)) {
                    var imgobj = {
                        'imgname': file.name,
                        'imgsize': size,
                        'imgtype': file.type,
                        'imgsrc': src,
                        'imgdata': file,
                        'imgprogress': "opacity:0.5"
                    }
                    $scope.selectedfiles.push(imgobj);
                    $scope.filestoUpload.push(imgobj);
                }
            });
            console.log($scope.selectedfiles);
        }
        reader.readAsDataURL(file);
    }
}]);