mavikentApp.controller("SecurityCtrl", function($scope, $state, $http, $localStorage, $rootScope, $filter) {

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.list = [];
    $scope.users = [];
    $scope.floors = [];

    function initiliaze() {
        $scope.obj = {
            name: "",
            floor_id: "",
            security_order: "",
            security_guard_id: "",
            updated_by: $rootScope.mkb.current_user.name
        };

        $scope.floor = {
            selected: ""
        };
        $scope.user = {
            selected: ""
        };
    }

    initiliaze();

    $http.get(host + "/api/account?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.users = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/floor?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            
            return;
        }

        $scope.floors = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/security?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }

        $scope.list = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    //add function
    $scope.save = function() {
        $scope.obj.floor_id = $scope.floor.selected._id;
        $scope.obj.security_guard_id = $scope.user.selected._id;
        if ($scope.IsEdit) {
            $http.put(host + "/api/security?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
                }
                $scope.IsEdit = false;
                $scope.list[$scope.listIndex] = resp.data;
                initiliaze();
                $scope.office = {
                    selected: ""
                };
                swal("Başarılı!", "Güncelleme Başarılı!", "success")
            }).error(function(err) {
                console.error(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            });

        } else {
            $http.post(host + "/api/security?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
                }
                $scope.list.push(resp.data);
                initiliaze();
                swal("Başarılı!", "Ekleme Başarılı!", "success")
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
        $http.delete(host + "/api/security/" + id + "?token=" + token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            $scope.list.splice(index, 1);
            swal("Başarılı!", "Silme Başarılı!", "success")
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
        $scope.obj.floor_id = $scope.list[index].floor_id;
        $scope.obj.security_guard_id = $scope.list[index].security_guard_id;
        $scope.obj.security_order = $scope.list[index].security_order;
        $scope.obj.updated_by = $rootScope.mkb.current_user.name;
        $scope.obj._id = id;
        $scope.floor = {
            selected: $filter('getById')($scope.floors, $scope.obj.floor_id._id)
        }
        $scope.user = {
            selected: $filter('getById')($scope.users, $scope.obj.security_guard_id._id)
        }

    }
});