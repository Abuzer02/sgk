mavikentApp.controller("OfficeCtrl",function($scope,$state,$http,$localStorage,$rootScope,$filter){
    
    var token=$rootScope.mkb.token;
    $scope.IsEdit=false;
    $scope.listIndex;
    $scope.editId;
    $scope.list=[];
    $scope.floors=[];
    $scope.floor={selected : ""};
    
    $scope.obj={
        name:"",
        floor_id:"",
        office_order:"",
        updated_by:$rootScope.mkb.current_user.name
    };
    //list all floor
    $http.get(host+"/api/floor?token="+token).success(function(resp){
        if(resp.status==true){
             $scope.floors=resp.data;
            // console.log(JSON.stringify($scope.floors));
        }
        else{
            console.error("state is false "+resp.state);
        }
       
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
      //list all ofis
    $http.get(host+"/api/office?token="+token).success(function(resp){
        if(resp.status==true){
            $scope.list=resp.data;
          //  console.log(JSON.stringify($scope.list));
        }
        else{
            console.error("state is false "+resp.state);
        }
       
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    //add function
    $scope.save=function(){
        $scope.obj.floor_id=$scope.floor.selected._id;
        if($scope.IsEdit){
            $http.put(host+"/api/office/?token="+token,$scope.obj).success(function(resp){
                if(!resp.status){
                    console.error("state is false "+resp.code);
                    return;
                }
                //console.log(JSON.stringify(resp.data));
                $scope.IsEdit=false;
                $scope.list[$scope.listIndex]=resp.data;
                $scope.obj={
                    name:"",
                    floor_id:"",
                    office_order:"",
                    updated_by:$rootScope.mkb.current_user.name
              };
                $scope.floor={selected : ""};
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
            
        }else{
            //console.log(JSON.stringify($scope.obj));
            $http.post(host+"/api/office?token="+token,$scope.obj).success(function(resp){
              if(!resp.status){
                    console.error("state is false "+resp.code);
                    return;
              }
              $scope.list.push(resp.data);
              $scope.obj={
                name:"",
                floor_id:"",
                office_order:"",
                updated_by:$rootScope.mkb.current_user.name
              };
                $scope.floor={selected : ""};
              //console.log(JSON.stringify(resp));  
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
        }
        
    }
    
    //delete function
    
    $scope.delete=function(id,index){
        $http.delete(host+"/api/office/"+id+"?token="+token).success(function(resp){
            $scope.list.splice(index,1);
            //console.log(JSON.stringify(resp));
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
        $scope.obj.floor_id=$scope.list[index].floor_id;
        $scope.obj.office_order=$scope.list[index].office_order;
        $scope.obj.updated_by=$rootScope.mkb.current_user.name;
        $scope.obj._id=id;
        $scope.floor={selected:$filter('getById')($scope.floors, $scope.obj.floor_id._id)}
    }
});