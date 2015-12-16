var mavikentApp = angular.module('mavikentApp', ['ui.router','satellizer', 'ngStorage'])

mavikentApp.run(function($rootScope, $state, $http) {
    $rootScope.mkb = {
        current_user : '',
        authenticated : false,
        token : null
    }
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
      templateUrl: 'template/menu.html'
  })
  .state('menu.dashboard', {
      url : 'dashboard',
      templateUrl: 'template/dashboard.html',
      controller: 'dashController as dash'
  })
})

mavikentApp.controller('authController', AuthController)
mavikentApp.controller('dashController', DashController)

function AuthController ($scope,$auth, $state, $rootScope, $localStorage,$timeout) {
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
          $rootScope.mkb.token = response.data.token
          $state.go('menu.dashboard', {});
        }else{
           $scope.message=stateControl(response.data.code);
        }
    });
  }
}

function DashController ($http, $rootScope) {
  var vm = this
  vm.getUser = function() {
    var req = {
      method : 'GET',
      url : 'http://192.168.1.22:3000/api/account'
    }
    $http(req).success(function(data){
      console.log(data)
      //$localStorage.$reset()
    })
  }
}

function stateControl(code){
    if(code==200){
        return {message:"Giriş başarılı",color:"#00FFEF"}
    }else if(code==404){
        return {message:"Sayfa getirilemedi",color:"#FF0000"}
    }else if(code==403){
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
    }else{
        return {message:"anythink",color:"#FF0000"}
    }
    
}
