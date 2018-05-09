app.controller("cart", function($scope, $http, $location, $window, service){
    $scope.initialize = function(vendor_url){
		$scope.displayCart(vendor_url);
    }
    $scope.displayCart = function(vendor_url){
        // console.log(url);
        // var url_split = url.split("/");
        $http({
			method: 'POST',
			url: '/cart/get',
			data: {_csrf, vendor_url},
			dataType: 'json'
		}).then(function suc(data){
            data = data.data;
            console.log(data);
			$scope.productsInfo = data;
		});
    }

    //ADD PRODUCTS INTO CART
    $scope.addProduct = function(){
        var product = $('.itemForm').serializeArray();
        product.push({name: '_csrf', value: _csrf});
        product = service.objectifyForm(product);

        // console.log(product);
        $http({
			method: 'POST',
			url: '/cart/add',
			data: product,
            dataType: 'jsonp',
            timeout: 4000
		}).then(function success(response){
            console.log("Hu pan");
            $('#wrap-sticky').html(response['cart']);
            $('#productModal').modal('hide');
            $('.product-total').html(response['qty']);
            $scope.displayCart();
        }, function error(response){
            console.log(response);
            if(response=="timeout") {
                $scope.addProduct();
            } 
        });
    }
});