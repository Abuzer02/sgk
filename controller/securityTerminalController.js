mavikentApp.controller("SecturityTerminalCtrl", function ($scope, $state, $http, $rootScope, $interval) {
    $scope.istekler = [];
    $scope.host = host;
    $scope.cikis = function () {
        $state.go("logout");
    }
    var security = $interval(function () {
        $http.post(host + "/api/emergency/search?token=" + $rootScope.mkb.token, {
            floor_no: $rootScope.mkb.current_user.floor_id.name,
            isActive: "false"
        }).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                $interval.cancel(security);
                return;
            }
            $scope.istekler = resp.data;
        }).error(function (err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(security);
        })

    }, 1000);


    $scope.istekAl = function (item, index) {
        $http.put(host + "/api/emergency?token=" + $rootScope.mkb.token, {
            _id: item._id,
            isActive: true
        }).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            console.log(resp, undefined, 4);
            swal("Başarılı!", "İstek Başarılı ile Alındı!", "success")
        }).error(function (err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }
})