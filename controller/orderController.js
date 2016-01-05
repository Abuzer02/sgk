mavikentApp.controller("OrderCtrl", function($scope, $rootScope, $http, $interval) {
    $scope.host = host + "/media/original/";
    $scope.token = $rootScope.mkb.token;
    $scope.floor_id = $rootScope.mkb.current_user.floor_id._id;
    $scope.obj = []
    $scope.siparisler = [];
    $scope.guncel_siparis_toplami = 0;
    $scope.gecmis_siparis_toplami = 0;
    $scope.up = function(index) {
        $scope.obj[index].piece = $scope.obj[index].piece + 1
    }
    $scope.down = function(index) {
        $scope.obj[index].piece = $scope.obj[index].piece - 1
    }

    var siparis = $interval(function() {
        $http.post(host + "/api/order/search?token=" + $scope.token, {
            account_id: $rootScope.mkb.current_user._id
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                $interval.cancel(siparis);
                return;
            }
            $scope.siparisler = resp.data
            var results = totalHesapla()
            $scope.gecmis_siparis_toplami = results.gecmis
            $scope.guncel_siparis_toplami = results.guncel
        }).error(function(err) {
            console.error(JSON.stringify(err));
             sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(siparis);
        });

    }, 1000)

    function totalHesapla() {
        var results = {
            gecmis: 0,
            guncel: 0
        }
        for (var i = 0; i < $scope.siparisler.length; i++) {
            if ($scope.siparisler[i].isActive == "true") {
                results.gecmis += parseFloat($scope.siparisler[i].total_price);

            } else {
                results.guncel += parseFloat($scope.siparisler[i].total_price);
            }
        }


        return results
    }

    $http.get(host + "/api/product/canteen_products/" + $scope.floor_id + "?token=" + $scope.token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.products = resp.data;

        for (var i = 0; i < $scope.products.length; i++) {
            $scope.obj.push({
                floor_no: $rootScope.mkb.current_user.floor_id.name,
                room_no: $rootScope.mkb.current_user.room_id.name,
                desk_no: $rootScope.mkb.current_user.desk_id.name,
                account_id: $rootScope.mkb.current_user._id,
                canteen_id: $scope.products[i].canteen_id._id,
                product: $scope.products[i]._id,
                product_spec:"",
                piece: 1,
                total_price: 0,
                order_date: ""
            });

        }

    }).error(function(err) {
        console.error(JSON.stringify(err));
         sweetAlert("Oops...", "Bir hata oluştu", "error");
    });
    $scope.specClick=function(index,item){
        $scope.obj[index].product_spec=item;
        console.log($scope.obj[index].product_spec);
    }

    $scope.save = function(index) {
        $scope.obj[index].total_price = $scope.products[index].price * $scope.obj[index].piece;
        $http.post(host + "/api/order?token=" + $scope.token, $scope.obj[index]).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            $scope.siparisler.push(resp.data);
            $scope.guncel_siparis_toplami += parseFloat(resp.data.total_price);
            console.log(JSON.stringify(resp));
            $scope.obj[index] = {
                floor_no: $rootScope.mkb.current_user.floor_id.name,
                room_no: $rootScope.mkb.current_user.room_id.name,
                desk_no: $rootScope.mkb.current_user.desk_id.name,
                account_id: $rootScope.mkb.current_user._id,
                canteen_id: $scope.products[index].canteen_id._id,
                product: $scope.products[index]._id,
                product_spec:"",
                piece: 1,
                total_price: 0,
                order_date: ""
            }
            swal("Başarılı!", "Sipariş Başarılı eklendi!", "success")
        }).error(function(err) {
                console.error(JSON.stringify(err));
             sweetAlert("Oops...", "Bir hata oluştu", "error");
        });
    }

    $scope.delete = function(index, id) {
         swal({
            title: "Emin misiniz?",
            text: "Bu öğeyi silmek istedğinizden emin misiniz?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet",
            closeOnConfirm: false }, function(){
        $http.delete(host + "/api/order/" + id + "?token=" + $scope.token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            console.log(JSON.stringify(resp));
            $scope.guncel_siparis_toplami -= parseFloat($scope.siparisler[index].total_price);;
            $scope.siparisler.splice(index, 1);
            swal("Başarılı!", "Silme Başarılı!", "success")

        }).error(function(err) {
            console.error(JSON.stringify(err));
             sweetAlert("Oops...", "Bir hata oluştu", "error");
        });
        });

    }
})
