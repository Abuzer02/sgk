mavikentApp.controller("GetOrderCtrl",function($scope,$rootScope,$http){
   
    $http.post(host+"/api/order/search?token="+$rootScope.mkb.token,{floor_no : $rootScope.mkb.current_user.floor_id.name}).success(function(resp){
       // console.log(JSON.stringify(resp))
        $scope.list=resp.data;
    }).error(function(err){
        console.log(JSON.stringify(err));
    })
   // var socket = io('http://192.168.1.52:3000');
   
   /*  socket.on('cevap', function (data) {
        console.log(data);
        socket.emit('test', { my: 'data' });
      });
     */
    /* socket.on("order_update_result",function(data){
          console.log(data);
     })*/
    $scope.degCheck=function(id){
        //console.log(JSON.stringify($scope.list[index]));
       // for(var i=0;)
      
         
       
       
    }
});