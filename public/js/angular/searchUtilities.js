var sellerdata = "";
//RECENT ACTIVITY
app.controller("search", function($scope, $http, $location){

	$scope.initialize = function(){
		$scope.getRecentActivity();

		if(getQueryVariable('q')){
			$scope.getRestaurants(getQueryVariable('q'));
		}else{
			$scope.getRestaurants();
		}
	}
	$scope.getRecentActivity = function(){
		$http({
			method: 'POST',
			url: '/getRecentActivity',
			data: {_csrf},
			dataType: 'json'
		}).then(function suc(data){
			data = data.data;
			$scope.recentActivityData = data;
		});
	}
	
	//RESTAURANTS
	$scope.getRestaurants = function(q=null){
		var data;
		data = {_csrf};
		if(q){
			data.q=q;
		}else{
			data.q='';
		}
		$http({
			method: 'POST',
			url: '/restaurants',
			data: data,
			dataType: 'json'
		}).then(function suc(data){
			data = data.data;
			$scope.restaurantsData = $scope.addRestaurantFeatures(data);
			$scope.allRestaurants = $scope.restaurantsData;
		});
	}
	
	$scope.addRestaurantFeatures = function(restaurantsData){
		restaurantsData.forEach(function(data){
			// Channge restaurant image src with current host
			data.imgsrc = location.protocol+"//"+location.host+"/"+data.imgsrc;
			// Set misc json to add required fields to display
			var misc = {};
			if(data.ratings >= 4.7){
				misc.ribbonClass = "award";
				misc.orderNowButtonClass = "btn-yellow";
			}else if(data.born <= 31){
				misc.ribbonClass = "new";
			}

			// Set restaurant type and css accordingly
			if( data.ratings >= 4.5){
				misc.restaurantType = 'Awesome';
				misc.backcolor = '#78c928';
				misc.border = '#60a533';
			}
			else if(data.ratings < 4.5 && data.ratings >= 3.5){
				misc.restaurantType = 'Good';
				misc.backcolor = '#3498db';
				misc.border = '#2980b9';
			}
			else if(data.ratings < 3.5 && data.ratings >= 2.5){
				misc.restaurantType = 'Average';
				misc.backcolor = '#f1c40f';
				misc.border = '#f39c12';
			}
			else if(data.ratings < 2.5 && data.ratings >= 1.5){
				misc.restaurantType = 'Poor';
				misc.backcolor = '#e67e22';
				misc.border = '#d35400';
			}
			else if(data.ratings < 1.5){
				misc.restaurantType = 'Bad';
				misc.backcolor = '#e74c3c';
				misc.border = '#c0392b';
			}
			
			// Ratings symbol
			var ratingsSymbol = "";
			for(var i = 0; i < 5; i++){
				if(data.ratings > i){
					ratingsSymbol += "<li></li>"
				}else{
					ratingsSymbol += "<li class='empty'></li>"
				} 
			}
			misc.ratingsSymbol = ratingsSymbol;

			// Price symbol
			var priceSymbol = "";
			for(var i = 0; i < 5; i++){
				if(data.price > i){
					priceSymbol += "<i class='fa fa-inr fa-lg'></i>"
				}
			}
			misc.priceSymbol = priceSymbol;


			data.misc = misc;
		});
		console.log(restaurantsData);
		return restaurantsData;
	}

	$scope.updatevalue = function(vendorid,codeid,val){
		console.log(vendorid);
	}

	// FILTERING AS PER FUNCTION INPUT(COLUMN) VALUE
	$scope.filterRestaurant = function(type){
		$scope.restaurantsData = $scope.allRestaurants;
		if(type == 'name'){
			$scope.restaurantsData.sort(function(a,b){
				var x = a.vendor_name.toLowerCase();
				var y = b.vendor_name.toLowerCase();
				if (x < y) {return -1;}
				if (x > y) {return 1;}
				return 0;
			});
		}else if(type == 'price'){
			$scope.restaurantsData.sort(function(a,b){
				return a.price - b.price;
			});
		}else if(type == 'ratings'){
			$scope.restaurantsData.sort(function(a,b){
				return b.ratings - a.ratings;
			});
		}
	}

	// INSTANT SEARCH BOX VALUE
	$scope.searchBox = function(){
		$scope.restaurantsData = $scope.allRestaurants;
		var re = new RegExp("^"+$scope.searchValue+".*","i"); 
		$scope.restaurantsData = [];
		for(var i=0; i<$scope.allRestaurants.length; i++){
			if($scope.allRestaurants[i].vendor_name.match(re)){
				$scope.restaurantsData.push($scope.allRestaurants[i]);
			}
		}
	}
});

//Get variable from query
function getQueryVariable(variable)
{
       var query = location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


function displayRestaurants(sellerdata){

	$('body').css('background','#fafafa');

	//START SERVER SIDE EVENTS FOR RECENT ACTIVITY
	var xsvalue = $('#checkforxs').css('display');
	if(xsvalue != 'none'){

		if(typeof(EventSource) !== "undefined") {
			var source = new EventSource("getRecentActivity");
			source.onmessage = function(event) {
				var d = JSON.parse(event.data);
			// //     // document.getElementById("result").innerHTML += d[0].diff + "<br>";
				recentActivity(d);
			};
		} else {
			// document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
		}
	}
}
	