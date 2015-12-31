mavikentApp.controller("CrewCtrl", function($scope, $state, $http, $localStorage, $rootScope, $filter) {

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.list = [];
    $scope.users = [];
    $scope.floor = [];

    function initiliaze() {
        $scope.obj = {
            name: "",
            floor_id: "",
            crew_order: "",
            crew_id: "",
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
            return;
        }
        $scope.users = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    $http.get(host + "/api/floor?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }

        $scope.floors = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    $http.get(host + "/api/crew?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }

        $scope.list = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    //add function
    $scope.save = function() {
        $scope.obj.floor_id = $scope.floor.selected._id;
        $scope.obj.crew_id = $scope.user.selected._id;
        if ($scope.IsEdit) {
            $http.put(host + "/api/crew?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                $scope.IsEdit = false;
                $scope.list[$scope.listIndex] = resp.data;
                initiliaze();
                $scope.office = {
                    selected: ""
                };
            }).error(function(err) {
                console.error(JSON.stringify(err));
            });

        } else {
            $http.post(host + "/api/crew?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                $scope.list.push(resp.data);
                initiliaze();
            }).error(function(err) {
                console.error(JSON.stringify(err));
            });
        }

    }



    $scope.delete = function(id, index) {
        $http.delete(host + "/api/crew/" + id + "?token=" + token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            $scope.list.splice(index, 1);
        }).error(function(err) {
            console.error(JSON.stringify(err));
        });
    }

    //edit function

    $scope.edit = function(id, index) {
        $scope.IsEdit = true;
        $scope.listIndex = index;
        $scope.editId = id;
        $scope.obj.name = $scope.list[index].name;
        $scope.obj.floor_id = $scope.list[index].floor_id;
        $scope.obj.crew_id = $scope.list[index].crew_id;
        $scope.obj.crew_order = $scope.list[index].crew_order;
        $scope.obj.updated_by = $rootScope.mkb.current_user.name;
        $scope.obj._id = id;
        $scope.floor = {
            selected: $filter('getById')($scope.floors, $scope.obj.floor_id._id)
        }
        $scope.user = {
            selected: $filter('getById')($scope.users, $scope.obj.crew_id._id)
        }

    }
});