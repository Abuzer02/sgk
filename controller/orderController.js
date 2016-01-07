mavikentApp.controller("OrderCtrl", function ($scope, $rootScope, $http) {
    $scope.productList = [];
    $scope.favoriteList = [];
    $scope.sendObject = {};
    $scope.canteen_id = "";
    $scope.host = host;
    $http.get(host + "/api/product?token=" + $rootScope.mkb.token).success(function (resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.canteen_id = resp.data[0].canteen_id._id;
        for (var i = 0; i < resp.data.length; i++) {
            if (resp.data[i].product_specs.length != 0) {
                for (var j = 0; j < resp.data[i].product_specs.length; j++) {

                    $scope.productList.push({
                        name: resp.data[i].name,
                        piece: 0,
                        product_spec: resp.data[i].product_specs[j],
                        unit_price: resp.data[i].price
                    });
                }
            } else {
                $scope.productList.push({
                    name: resp.data[i].name,
                    piece: 0,
                    product_spec: "",
                    unit_price: resp.data[i].price
                });
            }

        }
        // console.log($scope.productList);
    }).error(function (err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    })

    $http.post(host + "/api/favorite/search?token=" + $rootScope.mkb.token, {
        account_id: $rootScope.mkb.current_user._id
    }).success(function (resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.favoriteList = resp.data;
        // console.log($scope.productList);
    }).error(function (err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    })

    $scope.down = function (index) {
        if ($scope.productList[index].piece != 0) {
            $scope.productList[index].piece--;
        }

    }
    $scope.up = function (index) {
        if ($scope.productList[index].piece != 101) {
            $scope.productList[index].piece++;
        }

    }
    $scope.save = function () {
        $scope.sendObject = {
            room_no: $rootScope.mkb.current_user.room_id.name,
            desk_no: $rootScope.mkb.current_user.desk_id.name,
            canteen_id: $scope.canteen_id,
            account_id: $rootScope.mkb.current_user._id,
            basket: [],
            total_price: ""
        }
        var totalPrice = 0;
        for (var i = 0; i < $scope.productList.length; i++) {
            if ($scope.productList[i].piece != 0) {
                $scope.sendObject.basket.push($scope.productList[i]);
                var price = parseFloat($scope.productList[i].unit_price);
                totalPrice += $scope.productList[i].piece * price;
            }
        }
        $scope.sendObject.total_price = totalPrice.toString();
        $http.post(host + "/api/order?token=" + $rootScope.mkb.token, $scope.sendObject).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            alertify.success("Sipariş Başarılı");
            $scope.sendObject = {};
            for (var i = 0; i < $scope.productList.length; i++) {
                $scope.productList[i].piece = 0;
            }
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }
    $scope.addFavorite = function (index) {
        var obj = {
                account_id: $rootScope.mkb.current_user._id,
                name: $scope.productList[index].name,
                piece: $scope.productList[index].piece,
                product_spec: $scope.productList[index].product_spec,
                unit_price: $scope.productList[index].unit_price
            }
            //  $scope.favoriteList.push();
        $http.post(host + "/api/favorite?token=" +
            $rootScope.mkb.token, obj).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            $scope.favoriteList.push(resp.data);
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }
    $scope.downFavorite = function (index) {
        if ($scope.favoriteList[index].piece != 0) {
            $scope.favoriteList[index].piece--;
        }

    }
    $scope.upFavorite = function (index) {
        if ($scope.favoriteList[index].piece != 101) {
            $scope.favoriteList[index].piece++;
        }

    }
    $scope.deleteFavorite = function (index) {
        $http.delete(host + "/api/favorite/" + $scope.favoriteList[index]._id + "?token=" + $rootScope.mkb.token).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            alertify.success("Başarı ile silindi");
            $scope.favoriteList.splice(index, 1);
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        });
    }
    $scope.saveFromFavorite = function () {
        $scope.sendObject = {
            room_no: $rootScope.mkb.current_user.room_id.name,
            desk_no: $rootScope.mkb.current_user.desk_id.name,
            canteen_id: $scope.canteen_id,
            account_id: $rootScope.mkb.current_user._id,
            basket: [],
            total_price: ""
        }
        var totalPrice = 0;
        for (var i = 0; i < $scope.favoriteList.length; i++) {
            if ($scope.favoriteList[i].piece != 0) {
                $scope.sendObject.basket.push($scope.favoriteList[i]);
                var price = parseFloat($scope.favoriteList[i].unit_price);
                totalPrice += $scope.favoriteList[i].piece * price;
            }
        }
        $scope.sendObject.total_price = totalPrice.toString();
        $http.post(host + "/api/order?token=" + $rootScope.mkb.token, $scope.sendObject).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            alertify.success("Sipariş Başarılı");
            for (var i = 0; i < $scope.favoriteList.length; i++) {
                $scope.favoriteList[i].piece = 0;
            }
            $scope.sendObject = {};
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }
})