mavikentApp.controller("MessageCtrl", function($scope, $http, $rootScope) {
    $scope.user = $rootScope.mkb.current_user.name;
    $scope.obj = {
        title: "",
        content: ""
    }
    $scope.save = function() {
        $http.post(host + "/api/notification?token=" + $rootScope.mkb.token, $scope.obj).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            $scope.obj = {
                title: "",
                content: ""
            }
            swal("Başarılı!", "Bildirim Başarı ile yapıldı!", "success")
        }).error(function(err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })

    }

});