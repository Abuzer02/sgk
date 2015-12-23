mavikentApp.controller("RoleCtrl",function($scope,$state,$http,$localStorage,$rootScope){
    
    var token=$rootScope.mkb.token;
    $scope.IsEdit=false;
    $scope.listIndex;
    $scope.editId;
    $scope.list=[];
    
    $scope.obj={
        name:"",
        role_order:"",
        updated_by:$rootScope.mkb.current_user.name
    };
    //list all item
    $http.get(host+"/api/role?token="+token).success(function(resp){
        if(resp.status==true){
             $scope.list=resp.data;
             //console.log(JSON.stringify($scope.list));
        }
        else{
            console.error("state is false "+resp.state);
        }
       
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    //add function
    $scope.save=function(){
        if($scope.IsEdit){
            $http.put(host+"/api/role/?token="+token,$scope.obj).success(function(resp){
                $scope.IsEdit=false;
                //console.log(resp);
                $scope.list[$scope.listIndex]=resp.data;
                $scope.obj={
                    name:"",
                    role_order:"",
                    updated_by:$rootScope.mkb.current_user.name
                };
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
            
        }else{
            $http.post(host+"/api/role?token="+token,$scope.obj).success(function(resp){
              $scope.list.push(resp.data);
              $scope.obj={
                name:"",
                role_order:"",
                updated_by:$rootScope.mkb.current_user.name
              };
             // console.log(JSON.stringify(resp));  
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
        }
        
    }
    
    //delete function
    
    $scope.delete=function(id,index){
        $http.delete(host+"/api/role/"+id+"?token="+token).success(function(resp){
            $scope.list.splice(index,1);
            console.log(JSON.stringify(resp));
        }).error(function(err){
            console.error(JSON.stringify(err));
        });
    }
    
    //edit function
    
    $scope.edit=function(id,index){
        $scope.IsEdit=true;
        $scope.listIndex=index;
        $scope.editId=id;
        $scope.obj.name=$scope.list[index].name;
        $scope.obj.role_order=$scope.list[index].role_order;
        $scope.obj.updated_by=$rootScope.mkb.current_user.name;
        $scope.obj._id=id;
    }
});