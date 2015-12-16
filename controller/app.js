var mavikentApp = angular.module('mavikentApp', ['ui.router','satellizer', 'ngStorage','ngSanitize', 'ui.select'])

mavikentApp.run(function($rootScope, $location, $http,$localStorage) {
    $rootScope.mkb = {
        current_user : '',
        authenticated : false,
        token : null
    }
    $rootScope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams) {
        
        if(!$localStorage["user"] && !$localStorage["token"]){
             $location.path('/login');
             
        }
    });
})

mavikentApp.config(function ($stateProvider, $urlRouterProvider, $authProvider){
  // Satellizer configuration that specifies which API
  // route the JWT should be retrieved from
  $authProvider.baseUrl = 'http://192.168.1.22:3000';
  $authProvider.loginUrl = '/auth/signin';

  // Redirect to the auth state if any other states
  // are requested other than users
  $urlRouterProvider.otherwise('/login');

  $stateProvider
  .state('login', {
      url : '/login',
      templateUrl: 'template/login-v2.html',
      controller: 'authController as auth'
  })
  .state('menu', {
      url : '/',
      abstract : true,
      templateUrl: 'template/menu.html',
      controller:'menuController'
  })
  .state('menu.dashboard', {
      url : 'dashboard',
      templateUrl: 'template/dashboard.html',
      controller: 'dashController as dash'
  })
  .state('menu.rol', {
      url : 'rol',
      templateUrl: 'template/rol.html',
  })
  .state('menu.kullanici_tanimlama', {
      url : 'kullanici_tanimlama',
      templateUrl: 'template/kullanici_tanimlama.html',
      controller: 'userController as user'
  })
  .state('menu.gorev', {
      url : 'gorev',
      templateUrl: 'template/gorev.html'
  })
  .state('menu.kat_tanimlama', {
      url : 'kat_tanimlama',
      templateUrl: 'template/kat_tanimlama.html'
  })
  .state('menu.urun_tanimlama', {
      url : 'urun_tanimlama',
      templateUrl: 'template/urun_tanimlama.html'
  })
  .state('menu.guvenlik_tanimlama', {
      url : 'guvenlik_tanimlama',
      templateUrl: 'template/guvenlik_tanimlama.html'
  })
  .state('menu.oda_tanimlama', {
      url : 'oda_tanimlama',
      templateUrl: 'template/oda_tanimlama.html'
  })
  .state('menu.cay_ocagi_tanimlama', {
      url : 'cay_ocagi_tanimlama',
      templateUrl: 'template/cay_ocagi_tanimlama.html',
      controller:'teacenterController'
  })
})

mavikentApp.controller('authController', AuthController)
mavikentApp.controller('dashController', DashController)
mavikentApp.controller('userController', UserController)
mavikentApp.controller('menuController', MenuController)
mavikentApp.controller('teacenterController', TeaCenterController)

function AuthController ($scope,$auth, $state, $rootScope, $localStorage) {
  var vm = this
  if ($localStorage['token']) {
    if (!$rootScope.mkb.token) {
      $rootScope.mkb.token = $localStorage['token']
    }
  }

  vm.login = function() {
    var credentials = {
      username : vm.username,
      password : vm.password
    }
    $auth.login(credentials).then(function(response) {
        if (response.data.state) {
          $scope.message=stateControl(response.data.code);
         if(!$localStorage["token"]){
             $localStorage["token"]=response.data.token;
          }
         if(!$localStorage["user"]){
             $localStorage["user"]=response.data.data;
         }
          $rootScope.mkb.token = response.data.token
          $state.go('menu.dashboard', {});
        }else{
           $scope.message=stateControl(response.data.code);
        }
    });
  }
}

function MenuController ($scope,$state,$http ,$rootScope,$localStorage) {
  $scope.logout=function(){
      localStorage.clear();
      $rootScope.mkb = {
        current_user : '',
        authenticated : false,
        token : null
    }
      $state.go("login");
  }
  $scope.checkTR=function(){
      var token =$localStorage["token"];
      alert(token);
      $http.get("http://192.168.1.22:3000/api/role?token="+token).then(function(resp){
          console.log(JSON.stringify(resp));
      },function(err){
          console.log(JSON.stringify(err));
      })
  }
}
function stateControl(code){
    if(code==200){
        return {message:"Giriş başarılı",color:"#00FFEF"}
    }else if(code==404){
        return {message:"Sayfa getirilemedi",color:"#FF0000"}
    }else if(code==407){
        return {message:"Kullanıcı eşleştirilemedi",color:"#FF0000"}
    }else if(code==401){
        return {message:"Kullanıcı sifresi hatalı",color:"#FF0000"}
    }else if(code==201){
        return {message:"Kullanıcı bilgileri doğrulandı",color:"#00FFEF"}
    }else if(code==405){
        return {message:"Token hatası",color:"#FF0000"}
    }else if(code==406){
        return {message:"Veritabanı hatası",color:"#FF0000"}
    }else if(code==402){
        return {message:"Bu kullanıcı zaten mevcut",color:"#FF0000"}
    }
    
}
function UserController ($scope) {

    $scope.people=[{name: 'sinan',age: 34, email:'sinan@gmail.com'}, {name: 'irfan',age: 17, email:'irfan@gmail.com'}]
    $scope.person={selected:''}
}

mavikentApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});
function TeaCenterController($scope){
     $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
}
function DashController($scope){

}

