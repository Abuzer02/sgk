mavikentApp.controller('authController', AuthController);

function AuthController($scope, $auth, $state, $rootScope, $localStorage, $http) {
    var vm = this
    if ($localStorage['token']) {
        if (!$rootScope.mkb.token) {
            $rootScope.mkb.token = $localStorage['token']
        }
    }

    vm.login = function () {
        var credentials = {
            username: vm.username,
            password: vm.password
        }
        $auth.login(credentials).then(function (response) {
            if (response.data.state) {
                $scope.message = stateControl(response.data.code);
                if (!$localStorage["token"]) {
                    $localStorage["token"] = response.data.token;
                }
                if (!$localStorage["user"]) {
                    $localStorage["user"] = response.data.data;
                }
                if (!$localStorage["navigation_url"]) {
                    $localStorage["navigation_url"] = response.data.navigation_url;
                }
                $rootScope.mkb.token = response.data.token
                $rootScope.mkb.navigation_url = response.data.navigation_url
                $rootScope.mkb.current_user = response.data.data
                $state.go($rootScope.mkb.navigation_url);

            } else {
                $scope.message = stateControl(response.data.code);
            }
        });
    }
    $scope.showModal = false;
    $scope.toggleModal = function () {
        $scope.showModal = !$scope.showModal;
    };
    $scope.newPass = {
        email: "",
        password: ""
    }
    $scope.updatePass = function () {
        $http.put(host + "/forgot/password", $scope.newPass).success(function (resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code, resp.data);
                return;
            }
            $scope.newPass = {
                email: "",
                password: ""
            }
            $scope.showModal = false;
            swal({
                title: "Başarılı",
                text: "şifre değişimi başarılı giriş sayfasına yönlendiriliyorsunuz",
                type: "success",
                timer: 1000,
                showConfirmButton: false
            });
        }).error(function (err) {
            console.error(JSON.stringify(err));
            sweetAlert("Oops...", "Bir hata oluştu", "error");
        })
    }
}