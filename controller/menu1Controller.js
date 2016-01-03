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
   $scope.git=function(url, event){
      $('#sidebar-menu a').removeClass('active')
      angular.element(event.currentTarget).addClass('active')
      //console.log(url)
      $state.go(url);
   }
   $scope.menuState = true
   $scope.menuToggle = function(){
     if ($scope.menuState) {
       $scope.menuState =false
       $('#wrapper').addClass('enlarged')
     }else{
       $scope.menuState = true
       $('#wrapper').removeClass('enlarged')
     }
   }
   $('[data-toggle=tooltip]').tooltip()

   $scope.host = host

$scope.isFullScreen = false
  $scope.fullScreen = function() {
    if(!$scope.isFullScreen){
      var el = document.documentElement,
        rfs = el.requestFullScreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        ;
      rfs.call(el);
      $scope.isFullScreen = true
    }else{
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      $scope.isFullScreen = false
    }
  };
}
