mavikentApp.controller("RoomServiceCtrl", function($scope, $state,$http, $rootScope, $interval) {
    $scope.istekler = [];
    $scope.host=host;
    $scope.cikis=function(){
        $state.go("logout");
    }

    var room = $interval(function() {
        $http.post(host + "/api/service/search?token=" + $rootScope.mkb.token, {
            floor_no: $rootScope.mkb.current_user.floor_id.name,
            isActive: "false"
        }).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                $interval.cancel(room);
                return;
            }
            $scope.istekler = resp.data;
        }).error(function(err) {
            console.log(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
            $interval.cancel(room);
        })

    }, 1000);


    $scope.istekAl = function(item, index) {
        $http.put(host + "/api/service?token=" + $rootScope.mkb.token, {
                _id: item._id,
                isActive: true
            }).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
                }
                swal("Başarılı!", "İstek Başarılı ile Alındı!", "success")
            }).error(function(err) {
                console.log(JSON.stringify(err));
                sweetAlert("Oops...", "Bir hata oluştu", "error");
            })
            /*
             $http.delete(host+"/api/service/"+item._id+"?token="+$rootScope.mkb.token).success(function(resp){
                console.log(resp,undefined,4);
            }).error(function(err){
                console.log(JSON.stringify(err));
            })*/
    }
})