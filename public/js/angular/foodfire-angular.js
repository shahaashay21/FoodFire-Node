var app = angular.module("foodfire", ['ngSanitize']);

app.filter('capitalize', function() {
    return function(input) {
        if(input == null || input == "") return;
        return input.replace(/\b\w/g, function(l){ return l.toUpperCase() })
    }
});

app.factory('cartService', function($http, $rootScope, commonService){
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
        extraInfo.total_qty = total_qty;
        extraInfo.restaurants = commonService.objectSize(cart);
        if(extraInfo.restaurants == 1){
            extraInfo.delivery_charge = 25;
            extraInfo.grand_total = parseInt(total + extraInfo.delivery_charge);
        } else {
            extraInfo.delivery_charge = parseInt((25 * extraInfo.restaurants)/1.5);
            extraInfo.grand_total = parseInt(total + extraInfo.delivery_charge);
        }
        $rootScope.extraInfo = extraInfo;
        // console.log(total);
        // console.log(total_without_tax);
        // console.log(total_qty);
    };
    function displayCart(){
        showCartLoader();
        $http({
            method: 'POST',
            url: '/cart/get',
            data: {_csrf},
            dataType: 'json',
            timeout: 4000
        }).then(function success(data){
            // console.log(data);
            hideCartLoader();
            var url = $(location).attr('href');
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
                // console.log($rootScope.cart);
                if(url.indexOf("/checkout")+1){
                    $rootScope.styleCartVendorDetails = {"max-height": "none"};
                    $rootScope.isCheckout = true;
                } else {
                    $rootScope.checkoutBtn = 1;
                }
            } else {
                $rootScope.cart = "";
                $rootScope.extraInfo = "";
                if(url.indexOf("www.foodfire.in/checkout")+1){
                    window.location="http://www.foodfire.in";
                }
            }
            if(typeof $rootScope.extraInfo === 'object' && $rootScope.extraInfo.total && $rootScope.extraInfo.total != null){
                $('.cart-dropdown').addClass('dropdown-menu');
                $('.product-total').html($rootScope.extraInfo.total_qty);
                $('.product-total-price').html('<i class="fa fa-inr"></i>'+ $rootScope.extraInfo.grand_total);
            }else{
                $('.cart-dropdown').removeClass('dropdown-menu');
                $('.product-total').html("");
                $('.product-total-price').html("");
            }
            if($(window).height() > 590){
                if(url.indexOf("www.foodfire.in/vendor/")+1){
                    $("#wrap-sticky").sticky({topSpacing:-10,bottomSpacing:120, getWidthFrom: '#product-cart' });	
                }
            }
            if(!('ontouchstart' in window))
            {
                $('[data-toggle="tooltip"]').tooltip();
            }
            // console.log($rootScope.cart);
        }, function (error){
            if(error.statusText=="timeout") {
                displayCart();
            } 
            hideCartLoader();
        });
    };
    function deleteProduct(cartid){
        $http({
            method: 'POST',
            url: '/cart/delete',
            data: {_csrf, cartid},
            dataType: 'json',
            timeout: 4000
        }).then(function success(response){
            displayCart();
        }, function (error){
            if(error.statusText=="timeout") {
                deleteProduct(cartid);
            }
        });
    };
    function updateProduct(cartid, qty){
        var error = false;
        if(qty == undefined || qty == "" || qty == null) {
            // _.forEach($rootScope.cart, function(items, vendorId){
            //     _.forEach(items, function(itemDetails, itemid){
            //         if($rootScope.cart[vendorId][itemid].cartid == cartid)
            //             $rootScope.itemQty[intemIndex] = $rootScope.cart[vendorId][itemid].qty;
            //     });
            // });
            error = true;
        }
        _.forEach($rootScope.cart, function(items, vendorId){
            _.forEach(items, function(itemDetails, itemid){
                if($rootScope.cart[vendorId][itemid].cartid == cartid && $rootScope.cart[vendorId][itemid].qty == qty ) {
                    console.log("SAME");
                    error = true;
                }
            });
        });
        if(!error){
            $http({
                method: 'POST',
                url: '/cart/update',
                data: {_csrf, cartid, qty},
                dataType: 'json',
                timeout: 4000
            }).then(function success(response){
                displayCart();
            }, function (error){
                if(error.statusText=="timeout") {
                    updateProduct(cartid, qty);
                }
            });
        }
    };
    return{
        displayCart: function(){
            displayCart()
        },
        deleteProduct: function(cartid){
            deleteProduct(cartid);
        },
        updateProduct: function (cartid, qty){
            updateProduct(cartid, qty);
        }
    };
});

app.factory('signService', function($http, $rootScope, cartService, commonService){
    function logout(){
        $http({
			method: "POST",
			url: "/logout",
			dataType: "json",
            data: {_csrf},
            timeout: 4000
        }).then(function success(response){
            console.log(response);
            var url = $(location).attr('href');
            if(url.indexOf("www.foodfire.in/user")+1){
                // location.reload();
                window.location=url;
            }
            if(response.data == "Logged out"){
                $(".php-log-out").hide();
                $(".php-log-in").hide();
                $(".ajax-logged-in").hide();
                $(".ajax-logged-out").show();
                cartService.displayCart();
            }
		}, function (error){
            // Some error
        });
    };
    function login(){
        // event.preventDefault();

		var data = $('.loginForm').serializeArray();
        data.push({name: '_csrf', value: _csrf});
        data = commonService.objectifyForm(data);

        $('.regAjaxLoading').show();
        $(".wrong-cred").hide();
                
		$http({
			method: "POST",
			url: "/login",
			dataType: "json",
			data: data,
			cache: false,
        }).then(function success(response){
            response = response.data;
            $('.regAjaxLoading').hide();
            if(response == "not verify"){
                $(".login-modal").modal('hide');
                alertline('alert-notify-warning','You have not verified your Email. <b>Please verify</b>');
            }
            else if(response == "fail"){
                $(".wrong-cred").show();
            }
            else{
                var url = $(location).attr('href');
                if(url.indexOf("www.foodfire.in/checkout")+1){
                    // location.reload();
                    window.location=url;
                }
                $(".login-modal").modal('hide');
                $(".php-log-out").hide();
                $(".php-log-in").hide();
                $(".ajax-logged-in").show();
                $(".ajax-logged-out").hide();
                $(".mob-user-name").html("<i class='fa fa-user fa-fw'></i>");
                $(".user-name").html(toTitleCase(response.username)+' <i class="fa fa-caret-down"></i>');
                cartService.displayCart();
            }
		});
    }
    return{
        logout: function(){
            logout();
        },
        login: function(){
            login();
        }
    }
})

app.factory('commonService', function($http, $rootScope){
    return{
        objectifyForm: function(formArray){//serialize data function
            var returnArray = {};
            for (var i = 0; i < formArray.length; i++){
                returnArray[formArray[i]['name']] = _.map(_.filter(formArray, {'name': formArray[i]['name']}), 'value');
                returnArray[formArray[i]['name']] = returnArray[formArray[i]['name']].toString();
            }
            return returnArray;
        },
        objectSize: function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        logout: function(){
            console.log("LOG OUT");
        }
    }
});