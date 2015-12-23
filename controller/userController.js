mavikentApp.controller('userController', UserController)
function UserController ($scope) {

    $scope.people=[{name: 'sinan',age: 34, email:'sinan@gmail.com'}, {name: 'irfan',age: 17, email:'irfan@gmail.com'}]
    $scope.person={selected:''}
}