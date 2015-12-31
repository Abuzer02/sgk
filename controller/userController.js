mavikentApp.controller('userController', UserController)
function UserController ($scope ,$http,$rootScope,$filter) {
    var token=$rootScope.mkb.token;
    var updatedBy=$rootScope.mkb.current_user.name;
    
    $("#myForm").attr("action",host+"/api/upload?token="+token);
    
    $("#myForm").ajaxForm(function(resp){
       console.log(resp); 
        if(resp.state==true){
            $("#img").attr("src",host+"/media/original/"+resp.mediaList.mediaList.name);
            
        }else{
            alert("hata");
        }
    });
    $scope.resimSec=function(e){
        e.preventDefault();
        $("#resim").click();
    }
    $("#resim").change(function(){
        $("#myForm").submit();
    })
    
    $scope.IsEdit=false;
    $scope.listIndex;
    $scope.editId;
    
    $scope.floors=[];
    $scope.offices=[];
    $scope.desks=[];
    $scope.tasks=[];
    $scope.roles=[];
    $scope.accounts=[];
    
    function initialize(){
        $scope.floor={selected : ""};
        $scope.office={selected : ""};
        $scope.desk={selected : ""};
        $scope.task={selected : ""};
        $scope.role={selected : ""};

        $scope.obj={
            email:"",
            username:"",
            name:"",
            password:"",
            account_order:"",
            is_active:"",
            phone_number:"",
            floor_id:"",
            room_id:"",
            desk_id:"",
            task_id:"",
            role_id:"",
            updated_by:updatedBy
        }
        $("#img").attr("src","http://placehold.it/400x400");
    }
    initialize();
    
    $http.get(host+"/api/floor?token="+token).success(function(resp){
        $scope.floors=resp.data;
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    
    $scope.degKat=function(){
         $http.get(host+"/api/office/get_by_floor/"+$scope.floor.selected._id+"?token="+token).success(function(resp){
                $scope.offices=resp.data;
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
    }
    
    //////////////////////////////////////////
    
    $http.get(host+"/api/office?token="+token).success(function(resp){
        $scope.rooms=resp.data;
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    
    //////////////////////////////////////////
   
    $scope.degOfis=function(){
      $http.get(host+"/api/desk/get_by_office/"+$scope.office.selected._id+"?token="+token).success(function(resp){
            $scope.desks=resp.data;
        }).error(function(err){
            console.error(JSON.stringify(err));
        });
    
    }
    
    //////////////////////////////////////////
    
    $http.get(host+"/api/desk?token="+token).success(function(resp){
        $scope.masalar=resp.data;
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    
    //////////////////////////////////////////
    
    $http.get(host+"/api/task?token="+token).success(function(resp){
        $scope.tasks=resp.data;
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    
    $http.get(host+"/api/role?token="+token).success(function(resp){
        $scope.roles=resp.data;
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    $http.get(host+"/api/account?token="+token).success(function(resp){
        $scope.accounts=resp.data;
       // console.log(JSON.stringify(resp));
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    $scope.save=function(){
        $scope.obj.profile_picture=$("#img").attr("src");
        $scope.obj.room_id = $scope.office.selected._id
        $scope.obj.floor_id = $scope.floor.selected._id
        $scope.obj.desk_id = $scope.desk.selected._id
        $scope.obj.role_id = $scope.role.selected._id
        $scope.obj.task_id = $scope.task.selected._id
        if($scope.IsEdit){
            $http.put(host+"/api/account?token="+token,$scope.obj).success(function(resp){
                if(!resp.status){
                    console.log("status : "+JSON.stringify(resp));
                    return;
                }
                $scope.IsEdit=false;
                $scope.accounts[$scope.listIndex]=resp.data[0];
                initialize();
            }).error(function(err){
                console.log(JSON.stringify(err));
            }) 
        }else{
            $http.post(host+"/api/account?token="+token,$scope.obj).success(function(resp){
                if(!resp.status){
                    console.log("status : "+JSON.stringify(resp));
                    return;
                }
                console.log(resp,undefined,4);
                $scope.accounts.push(resp.data);
                 initialize();
            }).error(function(err){
                console.log(JSON.stringify(err));
            })   
        }
    }
    
    $scope.delete=function(id,index){
        $http.delete(host+"/api/account/"+id+"?token="+token).success(function(resp){
            if(!resp.status){
                console.log("status : "+JSON.stringify(resp));
                return;
            }
            $scope.accounts.splice(index,1);
        }).error(function(err){
            console.log(JSON.stringify(err));
        })
    }
    $scope.edit=function(id,index){
        $scope.IsEdit=true;
        $scope.listIndex=index;
        $scope.editId=id;
        $scope.obj={
           _id:id,
            email:$scope.accounts[index].email,
            username:$scope.accounts[index].username,
            name:$scope.accounts[index].name,
            account_order:$scope.accounts[index].account_order,
            is_active:$scope.accounts[index].is_active,
            phone_number:$scope.accounts[index].phone_number,
            updated_by:updatedBy
        }
        $("#img").attr("src",$scope.accounts[index].profile_picture);
        if($scope.accounts[index].room_id){
            $scope.office={selected:$filter('getById')($scope.rooms, $scope.accounts[index].room_id._id)}
        }
        if($scope.accounts[index].floor_id){
            $scope.floor={selected:$filter('getById')($scope.floors, $scope.accounts[index].floor_id._id)}
        }
        if($scope.accounts[index].desk_id){
            $scope.desk={selected:$filter('getById')($scope.masalar, $scope.accounts[index].desk_id._id)}
        }
        if($scope.accounts[index].role_id){
            $scope.role={selected:$filter('getById')($scope.roles, $scope.accounts[index].role_id._id)}
        }
        if($scope.accounts[index].task_id){
            $scope.task={selected:$filter('getById')($scope.tasks, $scope.accounts[index].task_id._id)}
        }
        
        //console.log(JSON.stringify( $scope.accounts[index].task_id));
        console.log(JSON.stringify($scope.accounts[index]));
    }
}