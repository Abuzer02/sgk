mavikentApp.controller("SecturityTerminalCtrl",function($scope,$http,$rootScope ,$interval){
    $scope.istekler=[];
    $interval(function(){
          $http.post(host+"/api/emergency/search?token="+$rootScope.mkb.token,{floor_no : $rootScope.mkb.current_user.floor_id.name,isActive:"false"}).success(function(resp){
        $scope.istekler=resp.data;
    }).error(function(err){
        console.log(JSON.stringify(err));
    })
    
    },1000);
    
     
    $scope.istekAl=function(item,index){
        $http.put(host+"/api/emergency?token="+$rootScope.mkb.token,{_id : item._id, isActive : true}).success(function(resp){
            console.log(resp,undefined,4);
        }).error(function(err){
            console.log(JSON.stringify(err));
        })
        /*
         $http.delete(host+"/api/service/"+item._id+"?token="+$rootScope.mkb.token).success(function(resp){
            console.log(resp,undefined,4);
        }).error(function(err){
            console.log(JSON.stringify(err));
        })*/
    }
})