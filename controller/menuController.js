mavikentApp.controller('menuController', MenuController)

function MenuController ($scope,$state,$http ,$rootScope,$localStorage) {
   $scope.logout = function(){
       $state.go("logout")
   }
   $scope.checkTR=function(){
      var token =$localStorage["token"];
      alert(token);
      $http.get("http://192.168.1.22:3000/api/role?token="+token).then(function(resp){
          console.log(JSON.stringify(resp));
      },function(err){
          console.log(JSON.stringify(err));
      })
  }
}