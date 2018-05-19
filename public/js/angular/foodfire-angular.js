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
        }
    }
});