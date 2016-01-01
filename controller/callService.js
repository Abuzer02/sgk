mavikentApp.controller("OdaciCtrl", function($scope, $http, $rootScope, $interval) {
    $scope.obj = {};
    $scope.odaciIstekler = [];

    $http.get(host + "/api/crew/crew_by_floor/" + $rootScope.mkb.current_user.floor_id._id + "?token=" + $rootScope.mkb.token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            stateControl(resp.code,resp.data);
            return;
        }
        $scope.obj = {
            floor_no: $rootScope.mkb.current_user.floor_id.name,
            room_no: $rootScope.mkb.current_user.room_id.name,
            desk_no: $rootScope.mkb.current_user.desk_id.name,
            account_id: $rootScope.mkb.current_user._id,
            crew_id: resp.data._id,
            description: ""
        }
    }).error(function(err) {
        console.error(JSON.stringify(err));
        sweetAlert("Oops...", "Bir hata oluştu", "error");
    })
    var callTime = $interval(function() {
        $http.post(host + "/api/service/search?token=" + $rootScope.mkb.token, {
            account_id: $rootScope.mkb.current_user._id
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                $interval.cancel(callTime);
                return;
            }
            $scope.odaciIstekler = resp.data;
        }).error(function(err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(callTime);
        })

    }, 1000);

    $scope.save = function() {

        $http.post(host + "/api/service?token=" + $rootScope.mkb.token, $scope.obj).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
            $scope.obj.description = "";
            swal("Başarılı!", "Çağrı Başarılı!", "success")
            $scope.odaciIstekler.push(resp.data);
            
        }).error(function(err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }

});