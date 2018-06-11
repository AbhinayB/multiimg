angular.module('awtapp')
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
    });