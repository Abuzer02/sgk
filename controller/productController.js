mavikentApp.controller("ProductCtrl",function($scope,$state,$http,$localStorage,$rootScope,$filter){
    
    var token=$rootScope.mkb.token;
    $scope.IsEdit=false;
    $scope.listIndex;
    $scope.editId;
    $scope.list=[];
    $scope.canteens=[];
    
    
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
    
    
    function initiliaze(){
        $("#img").attr("src","http://placehold.it/400x400");
        $scope.obj={
            name:"",
            canteen_id :"",
            product_order:"",
            price:"",
            picture:"",
            updated_by:$rootScope.mkb.current_user.name
        };

        $scope.canteen={selected : ""};
    }
    
    initiliaze();
    
    $http.get(host+"/api/canteen?token="+token).success(function(resp){
        if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
             $scope.canteens=resp.data;
       
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    $http.get(host+"/api/product?token="+token).success(function(resp){
         if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                stateControl(resp.code,resp.data);
                return;
            }
        $scope.list=resp.data;
        
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    //add function
    $scope.save=function(){
        $scope.obj.picture=$("#img").attr("src");
        $scope.obj.canteen_id=$scope.canteen.selected._id; 
        if($scope.IsEdit){
            $http.put(host+"/api/product?token="+token,$scope.obj).success(function(resp){
                if(!resp.status){
                    console.error("state is false "+resp.code);
                    stateControl(resp.code,resp.data);
                    return;
                }
                $scope.IsEdit=false;
                console.log(JSON.stringify(resp.data));
                $scope.list[$scope.listIndex]=resp.data;
                initiliaze();
                $scope.office={selected : ""};
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
            
        }else{
            $http.post(host+"/api/product?token="+token,$scope.obj).success(function(resp){
              if(!resp.status){
                    console.error("state is false "+JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
              }
              $scope.list.push(resp.data);
              initiliaze();  
            }).error(function(err){
                console.error(JSON.stringify(err));
            });
        }
        
    }
    
    
    
    $scope.delete=function(id,index){
        $http.delete(host+"/api/product/"+id+"?token="+token).success(function(resp){
            if(!resp.status){
                    console.error("state is false "+JSON.stringify(resp));
                    stateControl(resp.code,resp.data);
                    return;
              }
            $scope.list.splice(index,1);
        }).error(function(err){
            console.error(JSON.stringify(err));
        });
    }
    
    //edit function
    
    $scope.edit=function(id,index){
        console.log(id);
        $("#img").attr("src",$scope.list[index].picture);
        $scope.IsEdit=true;
        $scope.listIndex=index;
        $scope.editId=id;
        $scope.obj.name=$scope.list[index].name;
        $scope.obj.canteen_id=$scope.list[index].canteen_id;
        $scope.obj.product_order=$scope.list[index].product_order;
        $scope.obj.price=$scope.list[index].price;
        $scope.obj.updated_by=$rootScope.mkb.current_user.name;
        $scope.obj._id=id;
        $scope.canteen={selected:$filter('getById')($scope.canteens, $scope.list[index].canteen_id._id)}
       
    }
});