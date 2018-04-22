// var foodfireApp = angular.module('foodfireAdmin', [], function($interpolateProvider) {
//         // $interpolateProvider.startSymbol('<%');
//         // $interpolateProvider.endSymbol('%>');
//     });

var foodfireApp = angular.module("foodfireAdmin",[]);

foodfireApp.controller('foodfireAdminController', function($scope, $http, $location){
	
	/*//////////////////////
	FORM FILLING WITH VALIDATION (PASSING DATA INFORMATION)
	1. METHOD - GET, POST
	2. URL (FROM HOST NAME)
	3. DATA (SHOULD BE IN JSON)
	4. MODEL ID
	5. SUCCESS MESSAGE
	//////////////////////*/
	$scope.formFill = function(method, url, data, modelId, sucMessage, done){
		angular.element(".input_text_box").removeClass("inputerr");
		angular.element(".ff-text-danger").remove();
		$http({
			method: method,
			url: url,
			data: data,
			dataType: 'json'
		}).then(function success(res){
			console.log(res.data);
			if(res.data == "logout"){
				window.location.assign("/v/login");
			}else if(res.data == "err"){
				alertline("alert-notify-danger","<b>Something went wrong!</b>");
			}else{
				if(res.data.msg == 1){
					angular.forEach(res.data.message, function(i,item){
						angular.element("#"+item).addClass("inputerr");
						angular.element("#"+item).after("<div class=\'col-xs-12 ff-text-danger\'>"+i+"</div>");
					});
				}else{
					if(modelId){
						angular.element("#"+modelId).modal("hide");
					}
					alertline("alert-notify-success",sucMessage);
				}
			}
			done();
		});
	};

	/*//////////////////////
	DATA FILLING (SELECTION BAR)
	1. METHOD - GET, POST
	2. URL (FROM HOST NAME)
	3. DATA (SHOULD BE IN JSON)
	//////////////////////*/
	$scope.dataFetch = function(method, url, data, back){
		$http({
			method: method,
			url: url,
			data: data,
			dataType: 'json'
		}).then(function success(res){
			// console.log(res.data);
			if(res.data == "logout"){
				window.location.assign("/v/login");
			}else if(res.data == "err"){
				alertline("alert-notify-danger","<b>Something went wrong, Can not fetch data!</b>");
			}else{
				back(res.data);
			}
		});
	};

	/*//////////////////////
	REMOVE FORM DATA AND ERRORS
	//////////////////////*/
	$scope.defaultForm = function(){
		$scope.feedAreaCountry = "";
		$scope.feedCityState = "";
		$scope.feedAreaState = "";
		$scope.feedAreaCity = "";
		$scope.feedStateCountry = "";
		$scope.feedCityCountry = "";
		angular.element(".input_text_box").val("");
		angular.element(".input_text_box").removeClass("inputerr");
		angular.element(".ff-text-danger").remove();
	}



	/*//////////////////////
		RESTAURANT PAGE
	//////////////////////*/
	//ADD NEW RESTAURANT
	$scope.addRestaurant = function(){
		data = {'restaurant': $scope.restaurant};
		sucMessage = "<b>Your restaurant has been created.</b>";

		$scope.formFill("POST", "/v/addrestaurant", data, "newRestaurant", sucMessage, function(){

		});
	};
	/*//////////////////////
	  RESTAURANT PAGE OVER
	//////////////////////*/



	/*//////////////////////
		LOCATION PAGE
	//////////////////////*/
	
	//DISPLAY ALL LOCATIONS
	$scope.showLocation = function(){
		data = {};
		$scope.dataFetch("POST", "/v/showlocation", data, function(retData){
			$scope.allLocation = retData;
			console.log(retData);
		});
	}

	//REMOVE LOCATION
	$scope.removeLocation = function(area_id){
		console.log(area_id);
		data = {"area_id": area_id};
		sucMessage = "<b>Location has been removed.</b>";
		$scope.formFill("POST", "/v/removearea", data, 0, sucMessage, function(){
			$scope.showLocation();
		});
	}
	// ADD DATA
	// ADD NEW COUNTRY
	$scope.addCountry = function(){
		data = {'country': $scope.country};
		sucMessage = "<b>Country has been added.</b>";
		$scope.formFill("POST", "/v/addcountry", data, "newCountry", sucMessage, function(){
		});
	}

	// ADD NEW STATE
	$scope.addState = function(){
		data = {'state': $scope.state};
		sucMessage = "<b>State has been added.</b>";

		$scope.formFill("POST", "/v/addstate", data, "newState", sucMessage, function(){

		});
	}

	// ADD NEW CITY
	$scope.addCity = function(){
		data = {'city': $scope.city};
		sucMessage = "<b>City has been added.</b>";

		$scope.formFill("POST", "/v/addcity", data, "newCity", sucMessage, function(){

		});
	}

	//ADD NEW AREA
	$scope.addArea = function(){
		data = {'area': $scope.area};
		sucMessage = "<b>Area has been added.</b>";

		$scope.formFill("POST", "/v/addarea", data, "newArea", sucMessage, function(){
			$scope.showLocation();
		});
	}



	//SHOW COUNTRY, STATE, CITY
	// SHOW COUNTRY
	$scope.showCountry = function(res){
		data = {};
		$scope.dataFetch("POST", "/v/showcountry", data, function(retData){
			res(retData);
		});
	}

	// SHOW STATE
	$scope.showState = function(modalName){
		// console.log(country_id);
		if(modalName == 'cityState'){
			data = {'country_id': $scope.city.country.country_id};
		}else if(modalName == 'areaState'){
			data = {'country_id': $scope.area.country.country_id};
		}else if(modalName == "newRestaurant"){
			data = {'country_id': "all"};
		}
		// console.log(data);
		$scope.dataFetch("POST", "/v/showstate", data, function(retData){
			console.log(retData);
			if(modalName == 'cityState'){
				$scope.feedCityState = retData[0].states;
				// console.log($scope.feedCityState);
			}else if(modalName == 'areaState'){
				$scope.feedAreaState = retData[0].states;
				// console.log($scope.feedAreaState);
			}else if(modalName == "newRestaurant"){
				// console.log(retData);
				$scope.feedRestaurantState = retData;
			}	
		});
	}

	// SHOW CITY
	$scope.showCity = function(modalName){
		data = {'state_id': $scope.area.state.state_id};
		console.log(data);
		$scope.dataFetch("POST", "/v/showcity", data, function(retData){
			$scope.feedAreaCity = retData[0].cityInfo;
		});
	}


	//OPEN COUNTRY MODEL
	angular.element("#newCountry").on('show.bs.modal', function(){
		$scope.defaultForm();
		$scope.country = "";
	});
	//OPEN STATE MODEL
	angular.element("#newState").on('show.bs.modal', function(){
		$scope.defaultForm();
		$scope.state = "";
		$scope.showCountry(function(countryData){
			console.log(countryData);
			$scope.feedStateCountry = countryData;
			$scope.state = {};
			$scope.state.country = $scope.feedStateCountry[0];
			console.log($scope.feedStateCountry[0].country_name);
		});
	});
	//OPEN CITY MODEL
	angular.element("#newCity").on('show.bs.modal', function(){
		$scope.defaultForm();
		$scope.city = "";
		$scope.showCountry(function(countryData){
			console.log(countryData);
			$scope.feedCityCountry = countryData;
		});
	});
	//OPEN AREA MODEL
	angular.element("#newArea").on('show.bs.modal', function(){
		$scope.defaultForm();
		$scope.area = "";
		$scope.showCountry(function(countryData){
			console.log(countryData);
			$scope.feedAreaCountry = countryData;
		});
	});

	//OPEN RESTAURANT MODAL
	angular.element("#newRestaurant").on('show.bs.modal', function(){
		$scope.showState("newRestaurant");
	});
	/*//////////////////////
	   LOCATION PAGE OVER
	//////////////////////*/

	/*//////////////////////
	   CALL ON PAGE LOAD
	//////////////////////*/
	if(window.location.pathname.indexOf("/v/location") >= 0){
		$scope.showLocation();
	}
	/*//////////////////////
	 CALL ON PAGE LOAD OVER
	//////////////////////*/
	

});


