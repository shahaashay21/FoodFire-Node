app.controller("cart", function($scope, $rootScope, $http, $location, $window, signService, commonService, cartService){
    $scope.initialize = function(){
        $scope.signService = signService;
        $scope.cartService = cartService;
        cartService.displayCart();
    }

    //ADD PRODUCTS INTO CART
    $scope.addProduct = function(){
        var product = $('.itemForm').serializeArray();
        product.push({name: '_csrf', value: _csrf});
        product = commonService.objectifyForm(product);
        $http({
			method: 'POST',
			url: '/cart/add',
			data: product,
            dataType: 'jsonp',
            timeout: 4000
		}).then(function success(response){
            $('#wrap-sticky').html(response['cart']);
            $('#productModal').modal('hide');
            $('.product-total').html(response['qty']);
            cartService.displayCart();
        }, function error(error){
            if(error.statusText=="timeout") {
                $scope.addProduct();
            } 
        });
    }
});