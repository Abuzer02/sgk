mavikentApp.controller('authController', AuthController);
function AuthController ($scope,$auth, $state, $rootScope, $localStorage) {
  var vm = this
  if ($localStorage['token']) {
    if (!$rootScope.mkb.token) {
      $rootScope.mkb.token = $localStorage['token']
    }
  }

  vm.login = function() {
    var credentials = {
      username : vm.username,
      password : vm.password
    }
    $auth.login(credentials).then(function(response) {
        if (response.data.state) {
          $scope.message=stateControl(response.data.code);
         if(!$localStorage["token"]){
             $localStorage["token"]=response.data.token;
          }
         if(!$localStorage["user"]){
             $localStorage["user"]=response.data.data;
         }
          $rootScope.mkb.token = response.data.token
          $rootScope.mkb.current_user = response.data.data
          $state.go('menu.dashboard', {});
        }else{
           $scope.message=stateControl(response.data.code);
        }
    });
  }
}