mavikentApp.controller("PermissionCtrl",function($scope,$rootScope,$http){
    
    ///Önemli Bu sayfa Çalışmıyor elden geçir
    
    
    $scope.sayfalar=[{name : "Rol Tanımlama",url:"role" , disabled:false},{name : "Görev Tanımlama",url:"task" , disabled:false},{name : "Kat Tanımlama",url:"floor" , disabled:false},{name : "Ofis Tanımlama",url:"office" , disabled:false},{name : "Masa Tanımlama",url:"desk" , disabled:false},{name : "Kullanıcı Tanımlama",url:"account" , disabled:false},{name : "Kantin Tanımlama",url:"canteen" , disabled:false},{name : "Ürün Tanımlama",url:"product", disabled:false},{name : "Güvenlik Tanımlama",url:"product", disabled:false},{name : "Button Tanımlama",url:"button", disabled:false},{name : "Odacı Tanımlama",url:"crew", disabled:false},{name : "İzinler",url:"permission", disabled:false},{name : "Yönlendirme",url:"navigation", disabled:false}];
    
     $scope.users=[];
     $scope.roles=[];
     $scope.izinliSayfalar=[]
     $scope.user={selected : ""};
     $scope.role={selected : ""};
    
    $scope.clearUser = function($event) {
       $event.stopPropagation(); 
       $scope.user.selected = "";
    };
    $scope.clearRole = function($event) {
       $event.stopPropagation(); 
       $scope.role.selected = "";
    };
    
    
    $scope.userChange=function(){
        $scope.izinliSayfalar=[]
        $http.post(host+"/api/permission/search?token="+$rootScope.mkb.token,{permission_id:$scope.user.selected._id}).success(function(resp){
           for(var i=0;i<resp.data.length;i++){
               var result = $scope.sayfalar.find(function (d) {
                                return d.url === resp.data[i].service_url;
                            });
               $scope.izinliSayfalar.push(result);
           }
        }).error(function(err){
            console.error(JSON.stringify(err));
        })
    }
    
    $scope.roleChange=function(){
        $scope.izinliSayfalar=[]
        $http.post(host+"/api/permission/search?token="+$rootScope.mkb.token,{permission_id:$scope.role.selected._id}).success(function(resp){
           for(var i=0;i<resp.data.length;i++){
               var result = $scope.sayfalar.find(function (d) {
                                return d.url === resp.data[i].service_url;
                            });
               $scope.izinliSayfalar.push(result);
           }
        }).error(function(err){
            console.error(JSON.stringify(err));
        })
    }
    
    $http.get(host+"/api/account?token="+$rootScope.mkb.token).success(function(resp){
             $scope.users=resp.data;
       
    }).error(function(err){
        console.error(JSON.stringify(err));
    });
    
    $http.get(host+"/api/role?token="+$rootScope.mkb.token).success(function(resp){
        $scope.roles=resp.data;
      //  $scope.roles.unshift({});
    }).error(function(err){
        console.error(JSON.stringify(err));
    });

    $scope.obj=[];
    
    $scope.al=function(item,index){
        ///hataaa Önemli 
         var elem={service_url : item.url}
         if($scope.obj.length == 0){
             $scope.obj.push(elem)
         }else{
             var len=$scope.obj.length;
          for(var i=0;i<len;i++){
            if( $scope.obj[i].service_url == item.url){
                     $scope.obj.splice(i,1);
            }else{
    
                $scope.obj.push(elem)
            }
        }
     }
        console.log(JSON.stringify($scope.obj))
}
    
    $scope.save=function(item){
        
        for(var i=0;i<$scope.obj.length;i++){
            if(item){
                $scope.obj[i].method_post=true;
            }else{
                $scope.obj[i].method_post=false;
            }

        }
        
    }
    $scope.read=function(item){
        
      for(var i=0;i<$scope.obj.length;i++){
            if(item){
                $scope.obj[i].method_get=true;
            }else{
                $scope.obj[i].method_get=false;
            }

        }
        
    }
    $scope.edit=function(item){
        
       for(var i=0;i<$scope.obj.length;i++){
            if(item){
                $scope.obj[i].method_put=true;
            }else{
                $scope.obj[i].method_put=false;
            }

        }
        
    }
    $scope.delete=function(item){
       for(var i=0;i<$scope.obj.length;i++){
            if(item){
                $scope.obj[i].method_delete=true;
            }else{
                $scope.obj[i].method_delete =false;
            }

        }
        
    }
    $scope.saveAll=function(){
        
        for(var i=0;i<$scope.obj.length;i++){
            if($scope.user.selected==""){
                $scope.obj[i].permission_id=$scope.role.selected._id;
            }else{
                $scope.obj[i].permission_id=$scope.user.selected._id;
            }
            
        }
        $http.post(host+"/api/permission?token="+$rootScope.mkb.token,$scope.obj).success(function(resp){
            console.log(resp,undefined,4);
            for(var i=0;i<resp.data.ops.length;i++){
               var result = $scope.sayfalar.find(function (d) {
                                return d.url === resp.data.ops[i].service_url;
                            });
               $scope.izinliSayfalar.push(result);
           }
            $scope.obj=[];
            $("#ulIzinsiz li").attr("class","list-group-item");
            $scope.editCheck=false;
            $scope.saveCheck=false;
            $scope.readCheck=false;
            $scope.deleteCheck=false;
        }).error(function(err){
            console.error(JSON.stringify(err));
        })
        
    }

})
