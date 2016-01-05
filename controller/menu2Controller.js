mavikentApp.controller("Menu2Ctrl",function($scope,$state,$rootScope){
    
     $scope.cikis=function(){
         $state.go("logout");
     }
})
