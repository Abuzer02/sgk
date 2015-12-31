mavikentApp.controller("PermissionCtrl", function($scope, $rootScope, $http, $filter) {

    $scope.sayfalar = [{
        name: "Rol Tanımlama",
        url: "role",
        disabled: false
    }, {
        name: "Görev Tanımlama",
        url: "task",
        disabled: false
    }, {
        name: "Kat Tanımlama",
        url: "floor",
        disabled: false
    }, {
        name: "Ofis Tanımlama",
        url: "office",
        disabled: false
    }, {
        name: "Masa Tanımlama",
        url: "desk",
        disabled: false
    }, {
        name: "Kullanıcı Tanımlama",
        url: "account",
        disabled: false
    }, {
        name: "Kantin Tanımlama",
        url: "canteen",
        disabled: false
    }, {
        name: "Ürün Tanımlama",
        url: "product",
        disabled: false
    }, {
        name: "Güvenlik Tanımlama",
        url: "product",
        disabled: false
    }, {
        name: "Button Tanımlama",
        url: "button",
        disabled: false
    }, {
        name: "Odacı Tanımlama",
        url: "crew",
        disabled: false
    }, {
        name: "İzinler",
        url: "permission",
        disabled: false
    }, {
        name: "Yönlendirme",
        url: "navigation",
        disabled: false
    }];

    $scope.users = [];
    $scope.roles = [];
    $scope.izinliSayfalar = []
    $scope.obj = [];
    $scope.list = []
    $scope.user = {
        selected: ""
    };
    $scope.role = {
        selected: ""
    };
    $scope.disabledPages=false;
    $scope.clearUser = function($event) {
        $event.stopPropagation();
        $scope.user.selected = "";
    };
    $scope.clearRole = function($event) {
        $event.stopPropagation();
        $scope.role.selected = "";
    };

    $http.get(host + "/api/account?token=" + $rootScope.mkb.token).success(function(resp) {
        $scope.users = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    $http.get(host + "/api/role?token=" + $rootScope.mkb.token).success(function(resp) {
        $scope.roles = resp.data;
    }).error(function(err) {
        console.error(JSON.stringify(err));
    });


    $http.get(host + "/api/permission?token=" + $rootScope.mkb.token).success(function(resp) {
        var arrList = resp.data;
        for (var i = 0; i < arrList.length; i++) {
            var element23 = $filter('getById')($scope.roles, arrList[i].permission_id);
            var element24 = $filter('getById')($scope.users, arrList[i].permission_id);
            if (element23 != null) {
                arrList[i].name = element23.name;
            }
            if (element24 != null) {
                arrList[i].name = element24.name;
            }
        }

        $scope.list = arrList;

    }).error(function(err) {
        console.log(JSON.stringify(err));
    })

    $scope.userChange = function() {
        $scope.izinliSayfalar = [];
        for (var j = 0; j < $scope.sayfalar.length; j++) {
            $scope.sayfalar[j].disabled = false;
        }
        $http.post(host + "/api/permission/search?token=" + $rootScope.mkb.token, {
            permission_id: $scope.user.selected._id
        }).success(function(resp) {
            $scope.izinliSayfalar = resp.data;
            for (var i = 0; i < $scope.izinliSayfalar.length; i++) {
                for (var j = 0; j < $scope.sayfalar.length; j++) {
                    if ($scope.izinliSayfalar[i].service_url == $scope.sayfalar[j].url) {
                        $scope.sayfalar[j].disabled = true;
                    }
                }
            }
        }).error(function(err) {
            console.error(JSON.stringify(err));
        })
    }

    $scope.roleChange = function() {
        $scope.izinliSayfalar = []
        for (var j = 0; j < $scope.sayfalar.length; j++) {
            $scope.sayfalar[j].disabled = false;
        }
        $http.post(host + "/api/permission/search?token=" + $rootScope.mkb.token, {
            permission_id: $scope.role.selected._id
        }).success(function(resp) {
            $scope.izinliSayfalar = resp.data;
            for (var i = 0; i < $scope.izinliSayfalar.length; i++) {
                for (var j = 0; j < $scope.sayfalar.length; j++) {
                    if ($scope.izinliSayfalar[i].service_url == $scope.sayfalar[j].url) {
                        $scope.sayfalar[j].disabled = true;
                    }
                }
            }
        }).error(function(err) {
            console.error(JSON.stringify(err));
        })
    }


    $scope.al = function(item, index) {
        var elem1 = {
            service_label: item.name,
            service_url: item.url,
            disabled: item.disabled
        }
        var result = $scope.obj.filter(function(a) {
            return a.service_url == item.url;
        });
        if (result.length != 0) {
            for (var i = 0; i < $scope.obj.length; i++) {
                if ($scope.obj[i].service_url == item.url) {
                    $scope.obj.splice(i, 1);
                    break;
                }
            }
        } else {
            $scope.obj.push(elem1);
        }
    }

    $scope.save = function(item) {

        for (var i = 0; i < $scope.obj.length; i++) {
            if (item) {
                $scope.obj[i].method_post = true;
            } else {
                $scope.obj[i].method_post = false;
            }

        }

    }
    $scope.read = function(item) {

        for (var i = 0; i < $scope.obj.length; i++) {
            if (item) {
                $scope.obj[i].method_get = true;
            } else {
                $scope.obj[i].method_get = false;
            }
        }

    }
    $scope.edit = function(item) {

        for (var i = 0; i < $scope.obj.length; i++) {
            if (item) {
                $scope.obj[i].method_put = true;
            } else {
                $scope.obj[i].method_put = false;
            }
            $scope.obj
        }

    }
    $scope.delete = function(item) {
        for (var i = 0; i < $scope.obj.length; i++) {
            if (item) {
                $scope.obj[i].method_delete = true;
            } else {
                $scope.obj[i].method_delete = false;
            }

        }

    }
    $scope.saveAll = function() {
        for (var i = 0; i < $scope.obj.length; i++) {
            if ($scope.user.selected == "") {
                $scope.obj[i].permission_id = $scope.role.selected._id;
            } else {
                $scope.obj[i].permission_id = $scope.user.selected._id;
            }

        }
        for (var j = 0; j < $scope.sayfalar.length; j++) {
            $scope.sayfalar[j].disabled = false;
        }
        // console.log($scope.obj);
        $http.post(host + "/api/permission?token=" + $rootScope.mkb.token, $scope.obj).success(function(resp) {
            for (var i = 0; i < resp.data.ops.length; i++) {
                $scope.izinliSayfalar.push(resp.data.ops[i]);
            }
            for (var i = 0; i < $scope.sayfalar.length; i++) {
                for (var j = 0; j < $scope.izinliSayfalar.length; j++) {
                    if ($scope.izinliSayfalar[j].service_url == $scope.sayfalar[i].url) {
                        $scope.sayfalar[i].disabled = true;
                    }
                }
            }

            var arrList = resp.data.ops;
            for (var i = 0; i < arrList.length; i++) {
                var element23 = $filter('getById')($scope.roles, arrList[i].permission_id);
                var element24 = $filter('getById')($scope.users, arrList[i].permission_id);
                if (element23 != null) {
                    arrList[i].name = element23.name;
                }
                if (element24 != null) {
                    arrList[i].name = element24.name;
                }
            }

            for (var i = 0; i < arrList.length; i++) {
                $scope.list.push(arrList[i]);
            }


            $scope.obj = [];
            $("#ulIzinsiz li").attr("class", "list-group-item");
            $scope.editCheck = false;
            $scope.saveCheck = false;
            $scope.readCheck = false;
            $scope.deleteCheck = false;
        }).error(function(err) {
            console.error(JSON.stringify(err));
        })

    }

    $scope.deleteItem = function(index, item) {
        $http.delete(host + "/api/permission/" + item._id + "?token=" + $rootScope.mkb.token).success(function(resp) {
            $scope.list.splice(index, 1);
        }).error(function(err) {
            console.log(JSON.stringify(err));
        })
    }

})