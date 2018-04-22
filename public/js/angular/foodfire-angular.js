var app = angular.module("foodfire", ['ngSanitize']);

app.filter('capitalize', function() {
    return function(input) {
        if(input == null || input == "") return;
        return input.replace(/\b\w/g, function(l){ return l.toUpperCase() })
    }
});