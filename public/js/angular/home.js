app.controller("home", function($scope, $rootScope, $http, $location, $window, signService, commonService, cartService){
    $scope.initialize = function(){
        $scope.signService = signService;
        $scope.cartService = cartService;
        cartService.displayCart();
    }
});