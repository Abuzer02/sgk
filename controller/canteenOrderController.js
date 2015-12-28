mavikentApp.controller("GetOrderCtrl",function($scope,$rootScope,$http,$interval){
   $scope.obj={};
   $interval(function(){
       $http.post(host+"/api/order/group_by_account_id?token="+$rootScope.mkb.token,{floor_no : $rootScope.mkb.current_user.floor_id.name, order_status : "wait"}).success(function(resp){
       //console.log(JSON.stringify(resp,undefined,4))
        $scope.list=resp.data;
       
    }).error(function(err){
        console.log(JSON.stringify(err));
    })
   },1000); 
    
    $http.post(host+"/api/order/search?token="+$rootScope.mkb.token,{order_status:"process"}).success(function(resp){
        if(resp.data.length==0){
            console.log("data bulunamadı.");
            return;
        }
        console.log(JSON.stringify(resp));
        $scope.obj.orders=resp.data;
        $scope.obj._id=$scope.obj.orders[0].account_id._id;
    }).error(function(err){
        console.log(JSON.stringify(err));
    })
    
    $scope.goster=function(item){
        var ids=[];
        for(var i =0;i<item.orders.length;i++){
            ids.push(item.orders[i]._id);
        }
     $http.put(host+"/api/order/update_status?token="+$rootScope.mkb.token,{ids: ids, update_area: {order_status : "process"}}).success(function(resp){
         
         $scope.obj=item;
     }).error(function(err){
         console.log(JSON.stringify(err))
     })
    }
    
    $scope.modify = function(item){

				$scope.modifyField = true;
				$scope.viewField = true;
			};


    $scope.update = function(item ,index){
        $scope.modifyField = false;
        $scope.viewField = false;
        
        $http.put(host+"/api/order?token="+$rootScope.mkb.token,{_id : item._id,piece : item.piece ,total_price : parseFloat(item.piece)*parseFloat(item.unit_price)}).success(function(resp){
            $scope.obj.orders[index]=resp.data;
            console.log(JSON.stringify(resp));
        }).error(function(err){
            console.log(JSON.stringify(err));
        })
    };
    
    $scope.onayla=function(){
         var ids=[];
        for(var i =0;i<$scope.obj.orders.length;i++){
            ids.push($scope.obj.orders[i]._id);
        }
       $http.put(host+"/api/order/update_status?token="+$rootScope.mkb.token,{ids: ids, update_area: {order_status : "accept" , isActive : true}}).success(function(resp){
         
         $scope.obj={};
     }).error(function(err){
         console.log(JSON.stringify(err))
     })
    }
    $scope.ertele=function(){
        var ids=[];
        for(var i =0;i<$scope.obj.orders.length;i++){
            ids.push($scope.obj.orders[i]._id);
        }
        $http.put(host+"/api/order/update_status?token="+$rootScope.mkb.token,{ids: ids, update_area: {order_status : "wait"}}).success(function(resp){
         
         $scope.obj={};
         
     }).error(function(err){
         console.log(JSON.stringify(err))
     })
    }
    $scope.iptal=function(){
        var ids=[];
        for(var i =0;i<$scope.obj.orders.length;i++){
            ids.push($scope.obj.orders[i]._id);
        }
        $http.put(host+"/api/order/update_status?token="+$rootScope.mkb.token,{ids: ids, update_area: {order_status : "reject"}}).success(function(resp){
         
         $scope.obj={};
         
     }).error(function(err){
         console.log(JSON.stringify(err))
     })
    }
});