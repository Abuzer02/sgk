mavikentApp.controller('menu1Controller', MenuController)

function MenuController ($scope,$state,$http ,$rootScope,$localStorage) {
   $scope.logout = function(){
       $state.go("logout")
   }
   $scope.checkTR=function(){
      var token =$localStorage["token"];
      $http.get(host+"/api/role?token="+token).then(function(resp){
          console.log(JSON.stringify(resp));
      },function(err){
          console.log(JSON.stringify(err));
      })
  }
   $scope.git=function(url){
       $state.go(url);
   }
}