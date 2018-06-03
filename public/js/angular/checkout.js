app.controller("checkout", function($scope, $rootScope, $http, $location, $window, signService, commonService, cartService){
    $scope.initialize = function(){
        $scope.signService = signService;
        $scope.cartService = cartService;
        cartService.displayCart();
        // console.log("I've been initialized");
    }

    $scope.newAddressModel = function(){
        $http({
            url: '/getcities',
            data: {'_csrf':_csrf},
            method: 'POST',
            dataType: 'jsonp',
            timeout: 4000
        }).then(function success(response){
            // $('.newaddressbox').html(response);
            $('#newaddress').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('body').css('padding-right','0px');
            $('#newaddress').modal('show');
            $scope.cities = response.data;
            $scope.currentCity = $scope.cities[0];

            if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
                $("#newaddress .modal-body").css("max-height","400px");
                $("#newaddress .modal-body").css("overflow","auto");
            }
            $scope.getAreas();
        }, function error(error){
            if(error.statusText=="timeout") {
                $scope.newAddressModel();
            }
        });
    }

    $scope.getAreas = function () {
        $http({
            method: 'POST',
            url: "/getareas",
            data: {'_csrf':_csrf, 'city': $scope.currentCity.cityunkid},
            dataType: 'jsonp',
            timeout: 4000
        }).then(function success(response){
            $("#address_area").empty();
            $scope.areas = response.data;
            $scope.currentArea = $scope.areas[0];
        }, function error(error){
            if(error.statusText=="timeout") {
                $scope.getAreas();
            }
        });
    }

    $scope.addNewAddress = function () {
        var addressdata = $(".newaddress").serializeArray();
        addressdata.push({name: '_csrf', value: _csrf});
        addressdata = commonService.objectifyForm(addressdata);
        $http({
            method: 'POST',
            url: "/address/add",
            data: addressdata,
            dataType: 'jsonp',
            timeout: 4000
        }).then(function success(response){
            if(response["alert"]){
                location.assign(window.location.pathname);
                // alertline(response["alerttype"],"<b>"+response["message"]+"</b>");
            }else{
                if(response["modal"] == 0){
                    $("#newaddress").modal("hide");
                }
                $("#newaddress").modal("handleUpdate");
                $(".input_text_box").removeClass("inputerr");
                $(".ff-text-danger").remove();
                $.each(response["message"], function(i,item){
                    $("#"+i).addClass("inputerr");
                    $("#"+i).after("<div class=\'col-xs-12 ff-text-danger\'>"+item+"</div>");
                });
            }
        }, function error(error){
            if(error.statusText=="timeout") {
                $scope.addNewAddress();
            }
        });
    }
});