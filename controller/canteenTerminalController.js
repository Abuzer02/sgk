mavikentApp.controller("GetOrderCtrl", function($scope, $state, $rootScope, $http, $interval) {
    $scope.siparis = true;
    $scope.urunEkle = false;
    $scope.host=host;
    var kantin = $interval(function() {
        $http.post(host + "/api/order/search?token=" + $rootScope.mkb.token, {
            floor_no: $rootScope.mkb.current_user.floor_id.name,
            order_status: "wait"
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                $interval.cancel(kantin);
                return;
            }
            $scope.list = resp.data;
           //console.log($scope.list);

        }).error(function(err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(kantin);
        })
    }, 1000);



    $scope.onayla = function(index) {
        var ids = [];
        ids.push($scope.list[index]._id);
        $http.put(host + "/api/order/update_status?token=" + $rootScope.mkb.token, {
            ids: ids,
            update_area: {
                order_status: "accept",
                isActive: true
            }
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            swal("Başarılı!", "Onay Başarılı!", "success")
        }).error(function(err) {
            console.log(JSON.stringify(err))
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }

    $scope.iptal = function(index) {
        var ids = [];
        ids.push($scope.list[index]._id);
        $http.put(host + "/api/order/update_status?token=" + $rootScope.mkb.token, {
            ids: ids,
            update_area: {
                order_status: "reject"
            }
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            swal("Başarılı!", "İptal İşlemi Başarılı!", "success")

        }).error(function(err) {
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
    $scope.cikis=function(){
        $state.go("logout");
    }

    $("#myForm").attr("action", host + "/upload?token=" + token);

    $("#myForm").ajaxForm(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        console.log(resp);
        if (resp.state == true) {
            $("#img").attr("src", host + "/media/original/" + resp.mediaList.mediaList.name);
            $scope.pctr = resp.mediaList.mediaList.name;

        } else {
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        }
    });
    $scope.resimSec = function(e) {
        e.preventDefault();
        $("#resim").click();
    }
    $("#resim").change(function() {
        $("#myForm").submit();
    })


    function initiliaze() {
        $("#img").attr("src", "http://placehold.it/400x400");
        $scope.spec_arr=[]
        $scope.objUrun = {
            product_specs:[],
            name: "",
            canteen_id: "",
            product_order: "",
            price: "",
            picture: "",
            updated_by: $rootScope.mkb.current_user.name
        };
    }

    initiliaze();

    $http.get(host + "/api/canteen/get_by_floor/" + $rootScope.mkb.current_user.floor_id._id + "?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.objUrun.canteen_id = resp.data[0]._id;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/product?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.listOrder = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    //add function

    $scope.save = function() {
        $scope.objUrun.picture = $scope.pctr;
        for(var i=0;i<$scope.spec_arr.length;i++){
            $scope.objUrun.product_specs.push($scope.spec_arr[i].text);
        }
        if ($scope.IsEdit) {
            $http.put(host + "/api/product?token=" + token, $scope.objUrun).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
                }
                $scope.IsEdit = false;
                $scope.listOrder[$scope.listIndex] = resp.data;
                swal("Başarılı!", "Güncelleme Başarılı!", "success")
                initiliaze();
            }).error(function(err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });

        } else {

            $http.post(host + "/api/product?token=" + token, $scope.objUrun).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
                }
                $scope.listOrder.push(resp.data);
                swal("Başarılı!", "Ekleme Başarılı!", "success")
                initiliaze();
            }).error(function(err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });
        }

    }



    $scope.delete = function(id, index) {
         swal({  
            title: "Emin misiniz?",   
            text: "Bu öğeyi silmek istedğinizden emin misiniz?",   
            type: "warning",  
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Evet",   
            closeOnConfirm: false }, function(){
        $http.delete(host + "/api/product/" + id + "?token=" + token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            $scope.listOrder.splice(index, 1);
            swal("Başarılı!", "Silme Başarılı!", "success")
        }).error(function(err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        });
        });
    }

    //edit function

    $scope.edit = function(id, index) {
        $("#img").attr("src", host + "/media/original/" + $scope.listOrder[index].picture);
        $scope.pctr =  $scope.listOrder[index].picture;
        $scope.IsEdit = true;
        $scope.listIndex = index;
        $scope.editId = id;
        $scope.objUrun.name = $scope.listOrder[index].name;
        $scope.objUrun.canteen_id = $scope.listOrder[index].canteen_id;
        $scope.objUrun.product_order = $scope.listOrder[index].product_order;
        $scope.objUrun.price = $scope.listOrder[index].price;
        $scope.objUrun.updated_by = $rootScope.mkb.current_user.name;
        $scope.objUrun._id = id;
        for(var i=0;i<$scope.listOrder[index].product_specs.length;i++){
            $scope.spec_arr.push({text : $scope.listOrder[index].product_specs[i]})
        }

    }

    $scope.siparisler = function() {
        $scope.siparis = true;
        $scope.urunEkle = false;
    }
    $scope.urunEkleme = function() {
        $scope.siparis = false;
        $scope.urunEkle = true;
    }
});
