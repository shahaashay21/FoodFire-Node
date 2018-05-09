var app = angular.module("foodfire", ['ngSanitize']);

app.filter('capitalize', function() {
    return function(input) {
        if(input == null || input == "") return;
        return input.replace(/\b\w/g, function(l){ return l.toUpperCase() })
    }
});

app.factory('service', function(){
    return{
        objectifyForm: function(formArray){//serialize data function
            var returnArray = {};
            for (var i = 0; i < formArray.length; i++){
            returnArray[formArray[i]['name']] = formArray[i]['value'];
            }
            return returnArray;
        }
    }
});