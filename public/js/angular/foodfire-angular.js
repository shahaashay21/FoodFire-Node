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
                let item_total_price = parseFloat(parseFloat(items[i].price) * parseFloat(items[i].qty));
                vendor_qty += parseFloat(items[i].qty);
                if(items[i].extraItems){
                    for(let j = 0; j < items[i].extraItems.length; j++){
                        if(items[i].extraItems[j].item_price != null){
                            item_total_price += parseFloat(items[i].extraItems[j].item_price);
                        }
                    }
                }
                $rootScope.cart[vendorId][i].item_total_price = item_total_price;
                vendor_total += item_total_price;
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
        updateWithPromo();
        // console.log(total);
        // console.log(total_without_tax);
        // console.log(total_qty);
    };
    function displayCart(){
        $rootScope.cart = "";
        showCartLoader();
        var data = {_csrf};
        if($rootScope.applied_promo && $rootScope.applied_promo != ""){
            data.promo_code = $rootScope.applied_promo;
        }
        $http({
            method: 'POST',
            url: '/cart/get',
            data: data,
            dataType: 'json',
            timeout: 4000
        }).then(function success(response){
            // console.log(response);
            hideCartLoader();
            var url = $(location).attr('href');
            if(response.data && response.data != null && response.data != "") {
                $rootScope.cart = response.data;
                $rootScope.cart = _.groupBy($rootScope.cart, 'vendorunkid');
                // console.log($rootScope.cart);

                // Evaluate cart
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
                if(url.indexOf("/checkout")+1){
                    window.location="/";
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
            error = true;
        }
        _.forEach($rootScope.cart, function(items, vendorId){
            _.forEach(items, function(itemDetails, itemid){
                if($rootScope.cart[vendorId][itemid].cartid == cartid && $rootScope.cart[vendorId][itemid].qty == qty ) {
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

    function applyPromo(){
        var promo_code = $("#promo_code").val();
        $rootScope.applied_promo = null;
        $rootScope.discount_type = null;
        $rootScope.discount = null;
        // if(promo_code == ""){
        //     promo_code = getCookie("firepromo");
        // }
        $http({
            method: 'POST',
            url: "/promo",
            data: {'_csrf':_csrf, promo_code: promo_code},
            dataType: 'jsonp',
            timeout: 50000
        }).then(function success(response){
            response = response.data;
            setCookie("firepromo", promo_code, 1);
            //Default
            $(".input_text_box").removeClass("inputerr");
            $(".ff-text-danger").remove();
            $(".applied_coupon").remove();

            if(response.alert){
                if(response.alertType && response.alertMessage)
                alertline(response.alertType, response.alertMessage);
            }
        
            if(response.error){
                // IF any other message
        
                // IF form
                $.each(response.message, function(i,message){
                    $("#"+i).addClass("inputerr");
                    $("#"+i).after("<div class=\'col-xs-12 ff-text-danger\'>"+message+"</div>");
                });
            } else {
                // IF SUCCESS
                $("#promo_code").after("<div class=\'col-xs-12 applied_coupon text-success\'>Coupon applied!</div>");
                $rootScope.applied_promo = promo_code;
                if(response.message){
                    $rootScope.discount_type = response.message.discount_type;
                    $rootScope.discount = response.message.discount;
                }
            }
            updateWithPromo();
        }, function error(error){
            if(error.statusText=="timeout") {
                $scope.addNewAddress();
            }
        });
    }
    function updateWithPromo(){
        $rootScope.updatedPromo = false;
        if($rootScope.extraInfo && $rootScope.extraInfo.grand_total && $rootScope.discount_type && $rootScope.discount){
            $rootScope.extraInfo.original_grand_total = $rootScope.extraInfo.grand_total;
            $rootScope.extraInfo.original_total_amount = $rootScope.extraInfo.total_without_tax;
            let tax = parseInt($rootScope.extraInfo.total - $rootScope.extraInfo.total_without_tax);
            if($rootScope.discount_type == 5){
                $rootScope.extraInfo.discounted_total_amount = parseInt($rootScope.extraInfo.original_total_amount - $rootScope.discount);
                $rootScope.updatedPromo = true;
            } else if($rootScope.discount_type == 6 && $rootScope.discount <= 100){
                $rootScope.extraInfo.discounted_total_amount = parseInt($rootScope.extraInfo.original_total_amount - (($rootScope.extraInfo.original_total_amount * $rootScope.discount) / 100));
                $rootScope.updatedPromo = true;
            }
            $rootScope.extraInfo.discounted_grand_amount = parseInt($rootScope.extraInfo.delivery_charge + tax + $rootScope.extraInfo.discounted_total_amount);
        }
    }
    return{
        displayCart: function(){
            displayCart()
        },
        deleteProduct: function(cartid){
            deleteProduct(cartid);
        },
        updateProduct: function (cartid, qty){
            updateProduct(cartid, qty);
        },
        applyPromo: function (){
            applyPromo();
        }
    };
});

app.factory('signService', function($http, $rootScope, cartService, commonService, addressService){
    function logout(){
        $http({
			method: "POST",
			url: "/logout",
			dataType: "json",
            data: {_csrf},
            timeout: 4000
        }).then(function success(response){
            response = response.data;
            if(!response.error && response.message == "Logged out"){
                $(".php-log-out").hide();
                $(".php-log-in").hide();
                $(".ajax-logged-in").hide();
                $(".ajax-logged-out").show();
                cartService.displayCart();
                $rootScope.userAuthenticated = false;
            }
		}, function (error){
            // Some error
        });
    };
    function login(page){
        // event.preventDefault();
        var data = "";
        if(page == 'checkout'){
            data = $('.loginForm1').serializeArray();
        } else {
            data = $('.loginForm').serializeArray();
        }
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

            if(response.alert){
                if(response.alertType && response.alertMessage)
                alertline(response.alertType, response.alertMessage);
            }
            if(!response.modal){
                // Close modal
                $(".login-modal").modal('hide');
            }

            if(response.error){
                if(response.message == "fail"){
                    $(".wrong-cred").show();
                }
            } else {
                $(".login-modal").modal('hide');
                $(".php-log-out").hide();
                $(".php-log-in").hide();
                $(".ajax-logged-in").show();
                $(".ajax-logged-out").hide();
                $(".mob-user-name").html("<i class='fa fa-user fa-fw'></i>");
                $(".user-name").html(toTitleCase(response.message.username)+' <i class="fa fa-caret-down"></i>');
                cartService.displayCart();
                addressService.getAddress();
                $rootScope.userAuthenticated = true;

                var url = $(location).attr('href');
                if(url.indexOf("/checkout")+1){
                    $scope.getAddress();
                }
            }

            // alertline('alert-notify-warning','You have not verified your Email. <b>Please verify</b>');
		});
    }
    return{
        logout: function(){
            logout();
        },
        login: function(page){
            var page = page || null;
            login(page);
        }
    }
});

app.factory('addressService', function($http, $rootScope){
    return{
        getAddress: function () {
            $http({
                method: 'POST',
                url: "/address/get",
                data: {'_csrf':_csrf},
                dataType: 'jsonp',
                timeout: 4000
            }).then(function success(response){
                $rootScope.addresses = null;
                $rootScope.isAddressAvailable = true;
                if(response.data == "No address found"){
                    $rootScope.isAddressAvailable = false;
                } else if(response.data == "Please sign in to get an address"){

                } else {
                    $rootScope.isDefaultAddress = false;
                    $.each(response.data, function(i,address){
                        if(address.defaultadd == 1){
                            $rootScope.isDefaultAddress = true;
                            $rootScope.addunkid = address.addunkid;
                        }
                    });
                    if(!$rootScope.isDefaultAddress){
                        $rootScope.addunkid = response.data[0].addunkid;
                    }
                    $rootScope.addresses = response.data;
                }
            }, function error(error){
                if(error.statusText=="timeout") {
                    $rootScope.getAddress();
                }
            });
        }
    }
});

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