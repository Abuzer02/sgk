mavikentApp.controller("Menu2Ctrl",function($scope,$state,$rootScope){
    var arr=$state.current.name.split("menu2.");
    $("#anasayfa").attr("class","");
    $("#siparis").attr("class","");
    $("#odaci").attr("class","");
    $("#"+arr[1]).attr("class","selected")
    
     $scope.past=function(event,data,data1,data2){
        event.preventDefault();
        $("#"+data1).attr("class","");
        $("#"+data2).attr("class","");
        
        if($("#"+data).attr("class") != "selected") {
            $("#"+data).attr("class","selected")
            $state.go("menu2."+data)
            
        }
    }
})