mavikentApp.controller("PermissionCtrl", function ($scope, $rootScope, $http, $filter, $interval) {

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
        name: "İzinler Servisi",
        url: "permission",
        disabled: false
    }, {
        name: "Sipariş Servisi",
        url: "order",
        disabled: false
    }, {
        name: "Favori Siparişler Servisi",
        url: "favorite",
        disabled: false
    }, {
        name: "Ürün Servisi",
        url: "product",
        disabled: false
    }, {
        name: "Çağrı Servisi",
        url: "emergency",
        disabled: false
    }, {
        name: "Yönlendirme Servisi",
        url: "navigation",
        disabled: false
    }, {
        name: "Bildirim Servisi",
        url: "notification",
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
    $scope.izinliSayfalar2 = []
    $scope.obj = [];
    $scope.list = []
    $scope.user = {
        selected: ""
    };
    $scope.role = {
        selected: ""
    };
    $scope.disabledPages = false;
    $scope.clearUser = function ($event) {
        $event.stopPropagation();
        $scope.user.selected = "";
    };
    $scope.clearRole = function ($event) {
        $event.stopPropagation();
        $scope.role.selected = "";
    };

    $http.get(host + "/api/account?token=" + $rootScope.mkb.token).success(function (resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.users = resp.data;
        $scope.account_loaded = true;

    }).error(function (err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/role?token=" + $rootScope.mkb.token).success(function (resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.roles = resp.data;
        $scope.role_loaded = true;
    }).error(function (err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.userChange = function () {
            $scope.list = [];
            for (var j = 0; j < $scope.sayfalar.length; j++) {
                $scope.sayfalar[j].disabled = false;
            }
            $http.post(host + "/api/permission/search?token=" + $rootScope.mkb.token, {
                permission_id: $scope.user.selected._id
            }).success(function (resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                var arrList = resp.data;
                var element24 = $filter('getById')($scope.users, $scope.user.selected._id);
                for (var i = 0; i < arrList.length; i++) {

                    arrList[i].name = element24.name;
                }
                $scope.list = arrList;
                for (var i = 0; i < $scope.list.length; i++) {
                    for (var j = 0; j < $scope.sayfalar.length; j++) {
                        if ($scope.list[i].service_url == $scope.sayfalar[j].url) {
                            $scope.sayfalar[j].disabled = true;
                        }
                    }
                }
            }).error(function (err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            })
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.roleChange = function () {
            $scope.list = []
            for (var j = 0; j < $scope.sayfalar.length; j++) {
                $scope.sayfalar[j].disabled = false;
            }
            $http.post(host + "/api/permission/search?token=" + $rootScope.mkb.token, {
                permission_id: $scope.role.selected._id
            }).success(function (resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                var arrList = resp.data;
                var element23 = $filter('getById')($scope.roles, $scope.role.selected._id);
                for (var i = 0; i < arrList.length; i++) {

                    arrList[i].name = element23.name;
                }
                $scope.list = arrList;
                for (var i = 0; i < $scope.list.length; i++) {
                    for (var j = 0; j < $scope.sayfalar.length; j++) {
                        if ($scope.list[i].service_url == $scope.sayfalar[j].url) {
                            $scope.sayfalar[j].disabled = true;
                        }
                    }
                }
            }).error(function (err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            })
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.selectAllIzinsiz = function () {
        if ($scope.selectedAllIzinsiz == true) {
            $("#ulIzinsiz li:visible").attr("class", "list-group-item");
            $scope.selectedAllIzinsiz = false
            $scope.obj = [];
        } else {
            $("#ulIzinsiz li:visible").attr("class", "list-group-item active");
            $scope.selectedAllIzinsiz = true
            for (var i = 0; i < $scope.sayfalar.length; i++) {
                if ($scope.sayfalar[i].disabled == false) {
                    $scope.obj.push({
                        service_label: $scope.sayfalar[i].name,
                        service_url: $scope.sayfalar[i].url,
                        disabled: $scope.sayfalar[i].disabled,
                    });
                }

            }
        }
    }

    $scope.selectAllIzinli = function () {
        if ($scope.selectedAllIzinli == true) {
            $("#ulIzinli li:visible").attr("class", "list-group-item");
            $scope.selectedAllIzinli = false
        } else {
            $("#ulIzinli li:visible").attr("class", "list-group-item active");
            $scope.selectedAllIzinli = true
        }
    }

    $scope.al = function (item, index) {
        var elem1 = {
            service_label: item.name,
            service_url: item.url,
            disabled: item.disabled
        }
        var result = $scope.obj.filter(function (a) {
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
    $scope.saveAll = function () {
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
        $http.post(host + "/api/permission?token=" + $rootScope.mkb.token, $scope.obj).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
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


            for (var i = 0; i < $scope.sayfalar.length; i++) {
                for (var j = 0; j < $scope.list.length; j++) {
                    if ($scope.list[j].service_url == $scope.sayfalar[i].url) {
                        $scope.sayfalar[i].disabled = true;
                    }
                }
            }

            $scope.obj = [];
            $scope.editCheck = true;
            $scope.saveCheck = true;
            $scope.readCheck = true;
            $scope.deleteCheck = true;
            swal("Başarılı!", "Ekleme Başarılı!", "success")
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })


    }

    $scope.deleteItem = function (index, item) {
        swal({
            title: "Emin misiniz?",
            text: "Bu öğeyi silmek istedğinizden emin misiniz?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet",
            closeOnConfirm: false
        }, function () {
            $http.delete(host + "/api/permission/" + item._id + "?token=" + $rootScope.mkb.token).success(function (resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                var el2 = {
                    name: $scope.list[index].service_label,
                    url: $scope.list[index].service_url,
                    disabled: false
                }
                $scope.sayfalar.push(el2);
                $scope.list.splice(index, 1);
                swal("Başarılı!", "Silme Başarılı!", "success")
            }).error(function (err) {
                console.log(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            })
        })
    }

})