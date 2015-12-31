mavikentApp.controller("NavigationCtrl", function($scope, $state, $http, $localStorage, $rootScope, $filter) {

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.list = [];
    $scope.tasks = [];
    $scope.roles = [];
    $scope.pages = [{name : "Admin Paneli" , page_url : "menu.dashboard"},{name : "Genel Kullanıcı" , page_url : "menu2.anasayfa"},{name : "Çay Ocağı" , page_url : "kantin"},{name : "Oda Servisi" , page_url : "servis"},{name : "Güvenlik" , page_url : "guvenlik"}];

    function initialize() {
        $scope.role = {
            selected: ""
        };
        $scope.task = {
            selected: ""
        };
        $scope.page = {
            selected: ""
        };

        $scope.obj = {
            role: "",
            task: "",
            page_url: "",
            updated_by: $rootScope.mkb.current_user.name
        };
    }
    initialize();
    //list all office
    $http.get(host + "/api/role?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        $scope.roles = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    $http.get(host + "/api/task?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        $scope.tasks = resp.data;


    }).error(function(err) {
        console.error(JSON.stringify(err));
    });
    
    $http.get(host + "/api/navigation?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        for(var i=0;i<$scope.pages.length;i++){
            for(var j=0;j<resp.data.length;j++){
                if(resp.data[j].page_url == $scope.pages[i].page_url){
                    resp.data[j].page_name=$scope.pages[i].name;
                }
            }
        }
        $scope.list = resp.data;


    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    
    $scope.save = function() {
        $scope.obj.role = $scope.role.selected._id;
        $scope.obj.task = $scope.task.selected._id;
        $scope.obj.page_url = $scope.page.selected.page_url;
        console.log($scope.obj);
        if ($scope.IsEdit) {
            console.log("here 1");
            $http.put(host + "/api/navigation?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                for(var i=0;i<$scope.pages.length;i++){
                    if(resp.data.page_url == $scope.pages[i].page_url){
                        resp.data.page_name=$scope.pages[i].name;
                    }
                }
                $scope.IsEdit = false;
                $scope.list[$scope.listIndex] = resp.data;
                initialize();
            }).error(function(err) {
                console.error(JSON.stringify(err));
            });

        } else {
            //console.log(JSON.stringify($scope.obj));
            $http.post(host + "/api/navigation?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                for(var i=0;i<$scope.pages.length;i++){
                    if(resp.data.page_url == $scope.pages[i].page_url){
                        resp.data.page_name=$scope.pages[i].name;
                    }
                }
                $scope.list.push(resp.data);
                console.log(resp.data);
                initialize();
            }).error(function(err) {
                console.error(JSON.stringify(err));
            });
        }

    }

    //delete function

    $scope.delete = function(id, index) {
        $http.delete(host + "/api/navigation/" + id + "?token=" + token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            $scope.list.splice(index, 1);
        }).error(function(err) {
            console.error(JSON.stringify(err));
        });
    }

    //edit function

    $scope.edit = function(id, index) {
        $scope.IsEdit = true;
        $scope.listIndex = index;
        $scope.editId = id;
        $scope.obj.updated_by = $rootScope.mkb.current_user.name;
        $scope.obj._id = id;
        $scope.task = {
            selected: $filter('getById')($scope.tasks, $scope.list[index].task._id)
        }
        $scope.role = {
            selected: $filter('getById')($scope.roles, $scope.list[index].role._id)
        }
        for(var i=0;i<$scope.pages.length;i++){
            if($scope.pages[i].page_url == $scope.list[index].page_url){
                $scope.page = {
                    selected: {name : $scope.pages[i].name, page_url : $scope.pages[i].page_url} 
                }
            }
        }
        
    }
});