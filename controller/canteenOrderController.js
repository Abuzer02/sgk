mavikentApp.controller("GetOrderCtrl",function($scope,$rootScope,$http){
   
    $http.post(host+"/api/order/search?token="+$rootScope.mkb.token,{floor_no : $rootScope.mkb.current_user.floor_id.name}).success(function(resp){
        console.log(JSON.stringify(resp))
        $scope.list=resp.data;
    }).error(function(err){
        console.log(JSON.stringify(err));
    })
});