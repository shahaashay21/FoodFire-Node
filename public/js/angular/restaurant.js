app.controller("restaurant", function($scope, $http, $location, $window, service){
    var url = $location.absUrl().split('?')[0];
    $scope.initialize = function(vendor_url){
        $scope.getRestaurantProducts(vendor_url);
    }
    $scope.getRestaurantProducts = function(vendor_url){
        $http({
			method: 'POST',
			url: '/restaurantsProducts',
			data: {_csrf, vendor_url},
			dataType: 'json'
		}).then(function suc(data){
            data = data.data;
			$scope.productsInfo = data;
		});
    }

    $scope.productDetail = function(product_id){
        $http({
			method: 'POST',
			url: '/getItem',
			data: {_csrf, product_id},
            dataType: 'json',
            timeout: 4000
		}).then(function suc(data){
            data = data.data;
            $scope.itemInfo = data;

            $('#productModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('body').css('padding-right','0px');
            
            $('#productModal').modal('show');
		}, function error(response){
            // console.log(response);
            if(response.statusText == "timeout") {
                $scope.productDetail(id);
            } 
        });
    }
});