mavikentApp.controller("OdaciCtrl",function($scope,$http,$rootScope){
    $scope.obj={};
    $scope.odaciIstekler=[];
    
    $http.get(host+"/api/crew/crew_by_floor/"+$rootScope.mkb.current_user.floor_id._id+"?token="+$rootScope.mkb.token).success(function(resp){
        
        $scope.obj={
        floor_no:$rootScope.mkb.current_user.floor_id.name,
        room_no:$rootScope.mkb.current_user.room_id.name,
        desk_no:$rootScope.mkb.current_user.desk_id.name,
        account_id:$rootScope.mkb.current_user._id,
        crew_id:resp.data._id,
        description : ""
    }
    }).error(function(err){
        console.error(JSON.stringify(err));
    })
    
    $http.post(host+"/api/crew")
    
    $scope.save=function(){
        
        $http.post(host+"/api/service?token="+$rootScope.mkb.token,$scope.obj).success(function(resp){
            console.log(JSON.stringify(resp.data));
            $scope.odaciIstekler.push(resp.data);
            
        }).error(function(err){
            console.log(JSON.stringify(err));
        })
    }
    
});