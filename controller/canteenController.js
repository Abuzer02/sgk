mavikentApp.controller("CanteenCtrl", function($scope, $state, $http, $localStorage, $rootScope, $filter) {

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.list = [];
    $scope.users = [];

    function initiliaze() {
        $scope.obj = {
            name: "",
            canteen_order: "",
            canteen_boy_id: "",
            updated_by: $rootScope.mkb.current_user.name
        };
        $scope.user = {
            selected: ""
        };
    }

    initiliaze();

    $http.get(host + "/api/account?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            //stateControl(resp.code,resp.data);
            return;
        }
        $scope.users = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/canteen?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code, resp.data);
            return;
        }
        $scope.list = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    //add function
    $scope.save = function() {
        $scope.obj.canteen_boy_id = $scope.user.selected._id;
        if ($scope.IsEdit) {
            $http.put(host + "/api/canteen?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                $scope.IsEdit = false;
                console.log(JSON.stringify(resp.data));
                $scope.list[$scope.listIndex] = resp.data;
                swal("Başarılı!", "Güncelleme Başarılı!", "success")
                initiliaze();
                $scope.office = {
                    selected: ""
                };
            }).error(function(err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });

        } else {
            $http.post(host + "/api/canteen?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                $scope.list.push(resp.data);
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
            closeOnConfirm: false
        }, function() {
            $http.delete(host + "/api/canteen/" + id + "?token=" + token).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code, resp.data);
                    return;
                }
                $scope.list.splice(index, 1);
                swal("Başarılı!", "Öğe Başarılı ile Silindi!", "success")
            }).error(function(err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });
        });
    }

    //edit function

    $scope.edit = function(id, index) {
        $scope.IsEdit = true;
        $scope.listIndex = index;
        $scope.editId = id;
        $scope.obj.name = $scope.list[index].name;
        $scope.obj.canteen_boy_id = $scope.list[index].canteen_boy_id;
        $scope.obj.canteen_order = $scope.list[index].canteen_order;
        $scope.obj.updated_by = $rootScope.mkb.current_user.name;
        $scope.obj._id = id;
        $scope.user = {
            selected: $filter('getById')($scope.users, $scope.obj.canteen_boy_id._id)
        }

    }
});