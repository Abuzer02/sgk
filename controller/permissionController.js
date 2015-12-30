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
        $scope.izinliSayfalar=[];
        for(var j=0;j<$scope.sayfalar.length;j++){
            $scope.sayfalar[j].disabled=false;
        }
        $http.post(host+"/api/permission/search?token="+$rootScope.mkb.token,{permission_id:$scope.user.selected._id}).success(function(resp){
            $scope.izinliSayfalar=resp.data;
            for(var i =0;i<$scope.izinliSayfalar.length;i++){
                for(var j=0;j<$scope.sayfalar.length;j++){
                    if($scope.izinliSayfalar[i].service_url == $scope.sayfalar[j].url){
                        $scope.sayfalar[j].disabled=true;
                    }
                }
            }
        }).error(function(err){
            console.error(JSON.stringify(err));
        })
    }
    
    $scope.roleChange=function(){
        $scope.izinliSayfalar=[]
        for(var j=0;j<$scope.sayfalar.length;j++){
            $scope.sayfalar[j].disabled=false;
        }
        $http.post(host+"/api/permission/search?token="+$rootScope.mkb.token,{permission_id:$scope.role.selected._id}).success(function(resp){
           $scope.izinliSayfalar=resp.data;
            for(var i =0;i<$scope.izinliSayfalar.length;i++){
                for(var j=0;j<$scope.sayfalar.length;j++){
                    if($scope.izinliSayfalar[i].service_url == $scope.sayfalar[j].url){
                        $scope.sayfalar[j].disabled=true;
                    }
                }
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
         var elem1={service_label :item.name, service_url : item.url , disabled :item.disabled}
         var result = $scope.obj.filter(function( a ) {
                          return a.service_url == item.url;
                        });
        if(result.length!=0){
            for(var i =0; i <$scope.obj.length;i++){
             if($scope.obj[i].service_url == item.url){
                 $scope.obj.splice(i,1);
                 break;
             }
         }
        }else{
             $scope.obj.push(elem1);
         }
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
           $scope.obj
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
        console.log($scope.obj);
        for(var i=0;i<$scope.obj.length;i++){
            if($scope.user.selected==""){
                $scope.obj[i].permission_id=$scope.role.selected._id;
            }else{
                $scope.obj[i].permission_id=$scope.user.selected._id;
            }
            
        }
       // console.log($scope.obj);
        $http.post(host+"/api/permission?token="+$rootScope.mkb.token,$scope.obj).success(function(resp){
               console.log(resp,undefined,4);
            for(var i=0;i<resp.data.ops.length;i++){
                $scope.izinliSayfalar.push(resp.data.ops[i]);
            }
            for(var i =0;i<$scope.sayfalar.length;i++){
                for(var j=0;j<$scope.izinliSayfalar.length;j++){
                     if($scope.izinliSayfalar[j].service_url == $scope.sayfalar[i].url){
                         console.log($scope.sayfalar[i]);
                        $scope.sayfalar[i].disabled=true;
                    }  
                }
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
