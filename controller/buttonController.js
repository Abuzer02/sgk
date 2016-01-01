mavikentApp.controller("ButtonCtrl", function($scope, $state, $http, $localStorage, $rootScope, $filter) {

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.list = [];
    $scope.users = [];
    $scope.floors = [];
    $scope.offices = [];
    $scope.desks = [];

    function initiliaze() {
        $scope.obj = {
            button_id: "",
            floor_id: "",
            room_id: "",
            desk_id: "",
            button_order: "",
            account_id: "",
            updated_by: $rootScope.mkb.current_user.name
        };

        $scope.floor = {
            selected: ""
        };
        $scope.office = {
            selected: ""
        };
        $scope.desk = {
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

    $http.get(host + "/api/office?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.offices = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/desk?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.desks = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    });

    $http.get(host + "/api/button?token=" + token).success(function(resp) {
        
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
        $scope.obj.room_id = $scope.office.selected._id;
        $scope.obj.desk_id = $scope.desk.selected._id;
        $scope.obj.account_id = $scope.user.selected._id;
        if ($scope.IsEdit) {
            $http.put(host + "/api/button?token=" + token, $scope.obj).success(function(resp) {
                stateControl(resp.code);
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
                }
                $scope.IsEdit = false;
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
            $http.post(host + "/api/button?token=" + token, $scope.obj).success(function(resp) {
                stateControl(resp.code);
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
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
            closeOnConfirm: false }, function(){
            
            $http.delete(host + "/api/button/" + id + "?token=" + token).success(function(resp) {
                
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
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
        $scope.obj.button_id = $scope.list[index].button_id;
        $scope.obj.floor_id = $scope.list[index].floor_id;
        $scope.obj.room_id = $scope.list[index].room_id;
        $scope.obj.desk_id = $scope.list[index].desk_id;
        $scope.obj.account_id = $scope.list[index].account_id;
        $scope.obj.button_order = $scope.list[index].button_order;
        $scope.obj.updated_by = $rootScope.mkb.current_user.name;
        $scope.obj._id = id;
        $scope.floor = {
            selected: $filter('getById')($scope.floors, $scope.obj.floor_id._id)
        }
        $scope.office = {
            selected: $filter('getById')($scope.offices, $scope.obj.room_id._id)
        }
        $scope.desk = {
            selected: $filter('getById')($scope.desks, $scope.obj.desk_id._id)
        }
        $scope.user = {
            selected: $filter('getById')($scope.users, $scope.obj.account_id._id)
        }

    }
});