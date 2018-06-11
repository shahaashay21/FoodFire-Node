$http({
    method: 'POST',
    url: "/address/add",
    data: addressdata,
    dataType: 'jsonp',
    timeout: 4000
}).then(function success(response){
    response = response.data;

    // Default actions
    $(".input_text_box").removeClass("inputerr");
    $(".ff-text-danger").remove();

    if(response.alert){
        if(response.alertType && response.alertMessage)
        alertline(response.alertType, response.alertMessage);
    }
    if(!response.modal){
        // Hide modal
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
    }
}, function error(error){
    if(error.statusText=="timeout") {
        $scope.addNewAddress();
    }
});