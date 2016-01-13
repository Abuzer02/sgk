mavikentApp.controller("SecturityTerminalCtrl", function($scope, $state, $http, $rootScope, $interval) {
    $scope.istekler = [];
    $scope.host = host;
    $scope.cikis = function() {
        $state.go("logout");
    }

    function getList() {
        $http.post(host + "/api/emergency/search?token=" + $rootScope.mkb.token, {
            floor_no: $rootScope.mkb.current_user.floor_id.name,
            isActive: "false"
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                $interval.cancel(security);
                return;
            }
            $scope.istekler = resp.data;
        }).error(function(err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(security);
        })
    }
    getList();

    var security = $interval(function() {
        getList();

    }, 10000);


    $scope.istekAl = function(item, index) {
        $http.put(host + "/api/emergency?token=" + $rootScope.mkb.token, {
            _id: item._id,
            isActive: true
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            $scope.istekler.splice(index, 1);
            //  console.log(resp, undefined, 4);
            swal({
                title: "İstek",
                text: "başarı ile onaylandı",
                type: "success",
                timer: 1000,
                showConfirmButton: false
            });

        }).error(function(err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }

    $scope.show1Modal = false;
    $scope.toggleModal = function() {
        $scope.show1Modal = !$scope.show1Modal;
    };
    $scope.newPass = {
        password: ""
    }
    $scope.updatePass = function() {
        $http.put(host + "/api/account?token=" + $rootScope.mkb.token, {
            _id: $rootScope.mkb.current_user._id,
            password: $scope.newPass.password
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            $scope.newPass = {
                password: ""
            }
            console.log(resp.data);
            $scope.show1Modal = false;
            swal({
                title: "Başarılı",
                text: "şifre değişimi başarılı",
                type: "success",
                timer: 1000,
                showConfirmButton: false
            });
        }).error(function(err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }

})