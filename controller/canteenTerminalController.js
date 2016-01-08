mavikentApp.controller("GetOrderCtrl", function ($scope, $state, $rootScope, $http, $interval) {
    $scope.siparis = true;
    $scope.urunEkle = false;
    $scope.host = host;
    $scope.firstOrder = {}

    function canteenListAll() {
        $http.post(host + "/api/order/search?token=" + $rootScope.mkb.token, {
            isActive: "false"
        }).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                $interval.cancel(kantin);
                return;
            }
            $scope.firstOrder = resp.data[0];
            resp.data.splice(0, 1);
            $scope.list = resp.data;
            console.log($scope.list);

        }).error(function (err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(kantin);
        })
    }
    canteenListAll();
    var kantin = $interval(function () {
        canteenListAll();
    }, 10000);



    $scope.onayla = function () {
        $http.put(host + "/api/order?token=" + $rootScope.mkb.token, {
            _id: $scope.firstOrder._id,
            isActive: true
        }).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            swal({
                title: "Sipariş",
                text: "başarı ile onaylandı",
                type: "success",
                timer: 1000,
                showConfirmButton: false
            });
            console.log(resp.data);
            $scope.firstOrder = {}
        }).error(function (err) {
            console.log(JSON.stringify(err))
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }

    //urun ekle

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.listOrder = [];
    $scope.pctr = "";
    $scope.host = host;
    $scope.cikis = function () {
        $state.go("logout");
    }



    function initiliaze() {
        $("#img").attr("src", "http://placehold.it/400x400");
        $scope.spec_arr = []
        $scope.objUrun = {
            product_specs: [],
            name: "",
            canteen_id: "",
            product_order: "",
            price: "",
            picture: "",
            updated_by: $rootScope.mkb.current_user.name
        };
    }

    initiliaze();

    $http.get(host + "/api/canteen?token=" + token).success(function (resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.objUrun.canteen_id = resp.data[0]._id;

    }).error(function (err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/product?token=" + token).success(function (resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.listOrder = resp.data;

    }).error(function (err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    //add function

    $scope.save = function () {
        $scope.objUrun.picture = $scope.pctr;
        for (var i = 0; i < $scope.spec_arr.length; i++) {
            $scope.objUrun.product_specs.push($scope.spec_arr[i].text);
        }
        if ($scope.IsEdit) {
            $http.put(host + "/api/product?token=" + token, $scope.objUrun).success(function (resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                $scope.IsEdit = false;
                $scope.listOrder[$scope.listIndex] = resp.data;
                swal({
                    title: "Ürün",
                    text: "başarılı ile güncellendi",
                    type: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                initiliaze();
            }).error(function (err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });

        } else {

            $http.post(host + "/api/product?token=" + token, $scope.objUrun).success(function (resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                $scope.listOrder.push(resp.data);
                swal({
                    title: "Ürün",
                    text: "başarılı ile eklendi",
                    type: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                initiliaze();
            }).error(function (err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });
        }

    }



    $scope.delete = function (id, index) {
        $http.delete(host + "/api/product/" + id + "?token=" + token).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            $scope.listOrder.splice(index, 1);
            swal({
                title: "Ürün",
                text: "başarılı ile silindi",
                type: "success",
                timer: 1000,
                showConfirmButton: false
            });
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        });
    }

    //edit function

    $scope.edit = function (id, index) {
        $scope.pctr = $scope.listOrder[index].picture;
        $scope.IsEdit = true;
        $scope.listIndex = index;
        $scope.editId = id;
        $scope.objUrun.name = $scope.listOrder[index].name;
        $scope.objUrun.canteen_id = $scope.listOrder[index].canteen_id;
        $scope.objUrun.product_order = $scope.listOrder[index].product_order;
        $scope.objUrun.price = $scope.listOrder[index].price;
        $scope.objUrun.updated_by = $rootScope.mkb.current_user.name;
        $scope.objUrun._id = id;
        for (var i = 0; i < $scope.listOrder[index].product_specs.length; i++) {
            $scope.spec_arr.push({
                text: $scope.listOrder[index].product_specs[i]
            })
        }

    }

    $scope.siparisler = function () {
        $scope.siparis = true;
        $scope.urunEkle = false;
    }
    $scope.urunEkleme = function () {
        $scope.siparis = false;
        $scope.urunEkle = true;
    }
});