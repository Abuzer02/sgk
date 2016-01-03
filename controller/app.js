var mavikentApp = angular.module('mavikentApp', ['ui.router', 'satellizer', 'ngStorage', 'ngSanitize', 'ui.select', "angular.filter"])
mavikentApp.run(function($rootScope, $location, $state, $http, $localStorage, $window) {
    $rootScope.mkb = {
        current_user: '',
        authenticated: false,
        navigation_url: "",
        token: null
    }
    if ($localStorage["user"] && $localStorage["token"] && $localStorage["navigation_url"]) {
        $rootScope.mkb = {
            current_user: $localStorage["user"],
            authenticated: true,
            navigation_url: $localStorage["navigation_url"],
            token: $localStorage["token"]
        }
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (!$localStorage["user"] && !$localStorage["token"]) {
            $location.path('/login');
        }
        //console.log('From : ' + fromState.name);
        //console.log('To : ' + toState.name);
        if (toState.name == "login") {
            if (fromState.name.indexOf('menu1') > -1 || fromState.name.indexOf('menu2') > -1) {
                event.preventDefault()
            } else if (fromState.name.indexOf("kantin") > -1 || fromState.name.indexOf("odaci") > -1 || fromState.name.indexOf("guvenlik") > -1) {
                event.preventDefault()
            }
        } else if (fromState.name != "login" && toState.name != "logout") {
            if (fromState.name.indexOf("menu1") > -1) {
                if (!(toState.name.indexOf("menu1") > -1)) {
                    event.preventDefault();
                }
            } else if (fromState.name.indexOf("menu2") > -1) {
                if (!(toState.name.indexOf("menu2") > -1)) {
                    event.preventDefault();
                }
            } else if (fromState.name.indexOf("kantin") > -1 || fromState.name.indexOf("odaci") > -1 || fromState.name.indexOf("guvenlik") > -1) {
                event.preventDefault();
            }
        }
    });

    $rootScope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (!$localStorage["user"] && !$localStorage["token"]) {
            $location.path('/login');
        }
    });

    if ($rootScope.mkb.current_user && $rootScope.mkb.navigation_url) {
        $state.go($rootScope.mkb.navigation_url);
    }

})

mavikentApp.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from
    $authProvider.baseUrl = host;
    $authProvider.loginUrl = '/auth/signin';

    // Redirect to the auth state if any other states
    // are requested other than users
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'template/login-v2.html',
            controller: 'authController as auth'
        })
        .state("guvenlik", {
            url: "/guvenlik",
            templateUrl: "template/guvenlik_terminal.html",
            controller: "SecturityTerminalCtrl"
        })
        .state("odaci", {
            url: "/odaci",
            templateUrl: "template/odaci_terminal.html",
            controller: "RoomServiceCtrl"
        })
        .state("kantin", {
            url: "/kantin",
            templateUrl: "template/kantin_terminal.html",
            controller: "GetOrderCtrl"
        })
        .state('menu2', {
            url: '/',
            abstract: true,
            templateUrl: 'template/menu2.html',
            controller: "Menu2Ctrl"
        })
        .state('menu2.anasayfa', {
            url: 'anasayfa',
            templateUrl: 'template/anasayfa.html'
        })
        .state('menu2.siparis', {
            url: 'siparis',
            templateUrl: 'template/siparis_ver.html',
            controller: "OrderCtrl"
        })
        .state('menu2.servis_cagir', {
            url: 'servis_cagir',
            templateUrl: 'template/servis_cagir.html',
            controller: "OdaciCtrl"
        })
        .state('menu1', {
            url: '/',
            abstract: true,
            templateUrl: 'template/menu1.html',
            controller: 'menu1Controller'
        })
        .state('menu1.dashboard', {
            url: 'dashboard',
            templateUrl: 'template/dashboard.html',
            controller: 'dashController as dash'
        })
        .state('menu1.rol', {
            url: 'rol',
            templateUrl: 'template/rol.html',
            controller: "RoleCtrl"
        })
        .state('menu1.kullanici_tanimlama', {
            url: 'kullanici_tanimlama',
            templateUrl: 'template/kullanici_tanimlama.html',
            controller: 'userController as user'
        })
        .state('menu1.gorev', {
            url: 'gorev',
            templateUrl: 'template/gorev.html',
            controller: "TaskCtrl"
        })
        .state('menu1.kat_tanimlama', {
            url: 'kat_tanimlama',
            templateUrl: 'template/kat_tanimlama.html',
            controller: "FloorCtrl"
        })
        .state('menu1.guvenlik_tanimlama', {
            url: 'guvenlik_tanimlama',
            templateUrl: 'template/guvenlik_tanimlama.html',
            controller: "SecurityCtrl"
        })
        .state('menu1.kantin_tanimi', {
            url: 'kantin_tanimi',
            templateUrl: 'template/kantin_tanimi.html',
            controller: "CanteenCtrl"
        })
        .state('menu1.odaci_tanimlama', {
            url: 'odaci_tanimlama',
            templateUrl: 'template/odaci_tanimlama.html',
            controller: "CrewCtrl"
        })
        .state('menu1.ofis_tanimi', {
            url: 'ofis_tanimi',
            templateUrl: 'template/ofis_tanimi.html',
            controller: 'OfficeCtrl'
        })
        .state('menu1.masa_tanimi', {
            url: 'masa_tanimi',
            templateUrl: 'template/masa_tanimi.html',
            controller: 'DeskCtrl'
        })
        .state("menu1.izinler", {
            url: "izinler",
            templateUrl: "template/izinler.html",
            controller: "PermissionCtrl"
        })
        .state("menu1.yonlendirme", {
            url: "yonlendirme",
            templateUrl: "template/yonlendirme.html",
            controller: "NavigationCtrl"
        })
        .state("menu1.button", {
            url: "button",
            templateUrl: "template/button.html",
            controller: "ButtonCtrl"
        })
        .state('logout', {
            url: 'logout',
            controller: function($scope, $window, $localStorage, $rootScope) {
                //console.log("sadasd")
                localStorage.clear();
                $rootScope.mkb = {
                    current_user: '',
                    authenticated: false,
                    navigation_url: "",
                    token: null
                }
                $window.location.reload()
            }
        })
})

function stateControl(code, data) {
    if (code == 200) {
        return {
            message: "Giriş başarılı",
            color: "#00FFEF"
        };
    } else if (code == 404) {
        if (data && data.code && data.code == 11000) {
            return sweetAlert("Oops...", "Benzer Bir Öğe Mevcut!! lütfen Aynı olmaması gereken alanlara dikkat ediniz  ", "error");
        }
        return sweetAlert("Oops...", "Sayfa getirilemedi ", "error");
    } else if (code == 407) {
        return sweetAlert("Oops...", "Kullanıcı eşleştirilemedi ", "error")
    } else if (code == 401) {
        return sweetAlert("Oops...", "Kullanıcı sifresi hatalı", "error");
    } else if (code == 201) {
        return {
            message: "Kullanıcı bilgileri doğrulandı",
            color: "#00FFEF"
        }
    } else if (code == 405) {
        return sweetAlert("Oops...", "Token hatası", "error");
    } else if (code == 406) {
        return sweetAlert("Oops...", "Veritabanı hatası", "error");
    } else if (code == 402) {
        return sweetAlert("Oops...", "Bu kullanıcı zaten mevcut", "error");
    } else if (code == 408) {
        return sweetAlert("Oops...", "Bu İşleme Erişim izniniz yok", "error");
    } else if (code == 409) {
        return sweetAlert("Oops...", "Bu Sayfaya Erişim izniniz yok", "error");
    }

}

function statePageControl(code) {
    if (code == 200) {
        return {
            message: "Giriş başarılı",
            color: "#00FFEF"
        }
    } else if (code == 404) {
        return {
            message: "Sayfa getirilemedi",
            color: "#FF0000"
        }
    } else if (code == 407) {
        return {
            message: "Kullanıcı eşleştirilemedi",
            color: "#FF0000"
        }
    } else if (code == 401) {
        return {
            message: "Kullanıcı sifresi hatalı",
            color: "#FF0000"
        }
    } else if (code == 201) {
        return {
            message: "Kullanıcı bilgileri doğrulandı",
            color: "#00FFEF"
        }
    } else if (code == 405) {
        return {
            message: "Token hatası",
            color: "#FF0000"
        }
    } else if (code == 406) {
        return {
            message: "Veritabanı hatası",
            color: "#FF0000"
        }
    } else if (code == 402) {
        return {
            message: "Bu kullanıcı zaten mevcut",
            color: "#FF0000"
        }
    } else if (code == 408) {
        return {
            message: "Bu İşleme Erişim izniniz yok",
            color: "#FF0000"
        }
    } else if (code == 409) {
        return {
            message: "Bu Sayfaya Erişim izniniz yok",
            color: "#FF0000"
        }
    }

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

mavikentApp.filter('getById', function() {
    return function(input, id) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i]._id == id) {
                return input[i];
            }
        }
        return null;
    }
});

mavikentApp.filter('getByName', function() {
    return function(input, name) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i].name == name) {
                return input[i];
            }
        }
        return null;
    }
});


mavikentApp.directive("passwordVerify", function() {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});
