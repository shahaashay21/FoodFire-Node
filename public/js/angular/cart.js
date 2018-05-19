app.controller("cart", function($scope, $rootScope, $http, $location, $window, service){
    $scope.initialize = function(vendor_url){
        $scope.displayCart();
    }
    $scope.displayCart = function(){
        showCartLoader();
        $http({
			method: 'POST',
			url: '/cart/get',
			data: {_csrf},
            dataType: 'json',
            timeout: 4000
		}).then(function success(data){
            hideCartLoader();
            if(data.data && data.data != null && data.data != "") {
                $rootScope.cart = data.data;
                $rootScope.cart = _.groupBy($rootScope.cart, 'vendorunkid');
                // console.log($rootScope.cart);
                let delivery_time = 0;
                _.forEach($rootScope.cart, function(value, key){
                    delivery_time += parseFloat($rootScope.cart[key][0].del_time);
                });
                $rootScope.del_time = delivery_time;
                evaluateCart($rootScope.cart);
            }
            // console.log($rootScope.cart);
		}, function (error){
            if(error.statusText=="timeout") {
                $scope.displayCart();
            } 
            hideCartLoader();
        });
    }

    //ADD PRODUCTS INTO CART
    $scope.addProduct = function(){
        var product = $('.itemForm').serializeArray();
        product.push({name: '_csrf', value: _csrf});
        product = service.objectifyForm(product);
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
            $scope.displayCart();
        }, function error(error){
            if(error.statusText=="timeout") {
                $scope.addProduct();
            } 
        });
    }

    function evaluateCart(cart){
        let extraInfo = {};
        let delivery_time = 0;
        let grand_total = 0;
        let grand_qty = 0
        let total = 0;
        let total_without_tax = 0;
        let total_qty = 0;
        _.forEach(cart, function(items, vendorId){
            let vendor_qty = 0;
            let vendor_total = 0;
            delivery_time += parseFloat($rootScope.cart[vendorId][0].del_time);
            let tax = "";
            for(let i = 0; i < items.length; i++){
                let total_price = parseFloat(parseFloat(items[i].price) * parseFloat(items[i].qty));
                vendor_qty += parseFloat(items[i].qty);
                if(items[i].extraItems){
                    for(let j = 0; j < items[i].extraItems.length; j++){
                        if(items[i].extraItems[j].item_price != null){
                            total_price += parseFloat(items[i].extraItems[j].item_price);
                        }
                    }
                }
                $rootScope.cart[vendorId][i].total_price = total_price;
                vendor_total += total_price;
                tax = $rootScope.cart[vendorId][i].tax;
                // console.log($rootScope.cart[vendorId][i]);
            };
            $rootScope.cart[vendorId].vendor_total_without_tax = vendor_total;
            total_without_tax += vendor_total;
            if($rootScope.cart[vendorId][0].tax && !isNaN($rootScope.cart[vendorId][0].tax)){
                vendor_total = (vendor_total * (100+parseFloat($rootScope.cart[vendorId][0].tax))) / 100;
            }
            total_qty += vendor_qty;
            $rootScope.cart[vendorId].vendor_qty = vendor_qty;
            $rootScope.cart[vendorId].vendor_total = vendor_total;
            $rootScope.cart[vendorId].tax = tax;
            total += vendor_total;
            // console.log($rootScope.cart[vendorId][0].tax);
            // $rootScope.cart[vendorId].vendor_total = vendor_total;
        });
        extraInfo.delivery_time = delivery_time;
        extraInfo.total = total;
        extraInfo.total_without_tax = total_without_tax;
        extraInfo.restaurants = service.objectSize(cart);
        $rootScope.extraInfo = extraInfo;
        console.log($rootScope.cart);
        console.log(total);
        console.log(total_without_tax);
        console.log(total_qty);
    }
});