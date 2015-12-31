mavikentApp.controller("PermissionCtrl", function($scope, $rootScope, $http, $filter, $interval) {

    $scope.sayfalar = [{
        name: "Rol Servisi",
        url: "role",
        disabled: false
    }, {
        name: "Görev Servisi",
        url: "task",
        disabled: false
    }, {
        name: "Kat Servisi",
        url: "floor",
        disabled: false
    }, {
        name: "Ofis Servisi",
        url: "office",
        disabled: false
    }, {
        name: "Masa Servisi",
        url: "desk",
        disabled: false
    }, {
        name: "Kullanıcı Servisi",
        url: "account",
        disabled: false
    }, {
        name: "Kantin Servisi",
        url: "canteen",
        disabled: false
    }, {
        name: "Güvenlik Servisi",
        url: "security",
        disabled: false
    }, {
        name: "Button Servisi",
        url: "button",
        disabled: false
    }, {
        name: "Odacı Servisi",
        url: "crew",
        disabled: false
    }, {
        name: "İzinler Servisi",
        url: "permission",
        disabled: false
    }, {
        name: "Sipariş Servisi",
        url: "order",
        disabled: false
    },{
        name: "Oda Servisi",
        url: "service",
        disabled: false
    }, {
        name: "Ürün Servisi",
        url: "product",
        disabled: false
    },{
        name: "Acil Çağrı Servisi",
        url: "emergency",
        disabled: false
    }, {
        name: "Yönlendirme Servisi",
        url: "navigation",
        disabled: false
    }];
    
    $scope.account_loaded = false;
    $scope.role_loaded = false;
    $scope.saveCheck = true;
    $scope.readCheck = true;
    $scope.editCheck = true;
    $scope.deleteCheck = true;
    $scope.selectedAllIzinsiz = false;
    $scope.selectedAllIzinli = false;
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
    $scope.disabledPages = false;
    $scope.clearUser = function($event) {
        $event.stopPropagation();
        $scope.user.selected = "";
    };
    $scope.clearRole = function($event) {
        $event.stopPropagation();
        $scope.role.selected = "";
    };

    $http.get(host + "/api/account?token=" + $rootScope.mkb.token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        $scope.users = resp.data;
        $scope.account_loaded = true;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    $http.get(host + "/api/role?token=" + $rootScope.mkb.token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        $scope.roles = resp.data;
        $scope.role_loaded = true;
    }).error(function(err) {
        console.error(JSON.stringify(err));
    });
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.userChange = function() {
        $scope.izinliSayfalar = [];
        for (var j = 0; j < $scope.sayfalar.length; j++) {
            $scope.sayfalar[j].disabled = false;
        }
        $http.post(host + "/api/permission/search?token=" + $rootScope.mkb.token, {
            permission_id: $scope.user.selected._id
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            var arrList = resp.data;
                var element24 = $filter('getById')($scope.users, $scope.user.selected._id);
                for (var i = 0; i < arrList.length; i++) {
                    
                    arrList[i].name = element24.name;
                }
                $scope.list = arrList;
            
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    $scope.roleChange = function() {
        $scope.izinliSayfalar = []
        for (var j = 0; j < $scope.sayfalar.length; j++) {
            $scope.sayfalar[j].disabled = false;
        }
        $http.post(host + "/api/permission/search?token=" + $rootScope.mkb.token, {
            permission_id: $scope.role.selected._id
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            $http.post(host+"/api/permission/search?token="+$rootScope.mkb.token,{permission_id : $scope.role.selected._id}).success(function(respRole){
                if (respRole.status == false) {
                console.log("error : ", JSON.stringify(respRole));
                return;
            }
               var arrList = respRole.data;
                var element24 = $filter('getById')($scope.roles, $scope.role.selected._id);
                for (var i = 0; i < arrList.length; i++) {
                    
                    arrList[i].name = element24.name;
                }


                $scope.list = arrList;
            }).error(function(errUser){
                console.error(JSON.stringify(errUser));
            })
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    $scope.selectAllIzinsiz = function() {
        if ($scope.selectedAllIzinsiz == true) {
            $("#ulIzinsiz li [style = 'display : none']").attr("class", "list-group-item");
            $scope.selectedAllIzinsiz = false
            $scope.obj = [];
        } else {
            $("#ulIzinsiz li [style = 'display : block']").attr("class", "list-group-item active");
            $scope.selectedAllIzinsiz = true
            for (var i = 0; i < $scope.sayfalar.length; i++) {
                if($scope.sayfalar[i].disabled==false){
                    console.log($scope.sayfalar[i].disabled);
                    $scope.obj.push({
                    service_label: $scope.sayfalar[i].name,
                    service_url: $scope.sayfalar[i].url,
                    disabled: $scope.sayfalar[i].disabled,
                });
              }
                
            }
        }
    }

    $scope.selectAllIzinli = function() {
        if ($scope.selectedAllIzinli == true) {
            $("#ulIzinli li").attr("class", "list-group-item");
            $scope.selectedAllIzinli = false
        } else {
            $("#ulIzinli li").attr("class", "list-group-item active");
            $scope.selectedAllIzinli = true
        }
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
    $scope.saveAll = function() {
        console.log($scope.obj);
        for (var i = 0; i < $scope.obj.length; i++) {
            $scope.obj[i].method_get = $scope.readCheck;
            $scope.obj[i].method_put = $scope.editCheck;
            $scope.obj[i].method_post = $scope.saveCheck;
            $scope.obj[i].method_delete = $scope.deleteCheck;
        }

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
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            for (var i = 0; i < resp.data.ops.length; i++) {
                $scope.izinliSayfalar[0]=resp.data.ops[i];
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
            $scope.editCheck = true;
            $scope.saveCheck = true;
            $scope.readCheck = true;
            $scope.deleteCheck = true;
        }).error(function(err) {
            console.error(JSON.stringify(err));
        })


    }

    $scope.deleteItem = function(index, item) {
        $http.delete(host + "/api/permission/" + item._id + "?token=" + $rootScope.mkb.token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            $scope.list.splice(index, 1);
            for (var i = 0; i < $scope.izinliSayfalar.length; i++) {
                if ($scope.izinliSayfalar[i].service_url == item.service_url) {
                    console.log("here  ", item);
                    var el2 = {
                        name: $scope.izinliSayfalar[i].service_label,
                        url: $scope.izinliSayfalar[i].service_url,
                        disabled: false
                    }
                    $scope.sayfalar.push(el2);
                    $scope.izinliSayfalar.splice(i, 1);
                }
            }
        }).error(function(err) {
            console.log(JSON.stringify(err));
        })
    }

})