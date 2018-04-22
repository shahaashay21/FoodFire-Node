var collapseDefault = 0;

$(document).ready(function(){

	var path = window.location.pathname;
	// console.log(path);
	if(path == "/v/dashboard"){
		$(".fa-dashboard").closest("li").addClass("sidebar-active");
	}else if(path == "/v/restaurant"){
		$(".fa-fire").closest("li").addClass("sidebar-active");
	}
	else if(path == "/v/menu"){
		$(".fa-table").closest("li").addClass("sidebar-active");
	}
	else if(path == "/v/setting"){
		$(".fa-cog").closest("li").addClass("sidebar-active");
	}
	else if(path == "/v/location"){
		$(".fa-map-marker").closest("li").addClass("sidebar-active");
	}



	
	if(!($('#top-header').is(':hidden')))
	{
		// Mobile
		// console.log('Mobile');
		collapseDefault = 1;
	}else{

		if(typeof(sessionStorage.collapseDefault) != 'undefined'){
			// console.log('storage defined');
			collapseDefault = sessionStorage.collapseDefault;
		}
	}
	mobCheckSidebar(collapseDefault);

	
});

function sidebarCollapse(){
	if(collapseDefault == 0){
		collapseDefault = 1;
		if(typeof(Storage) !== "undefined"){
			sessionStorage.collapseDefault = 1;
		}
	}else{
		collapseDefault = 0;
		if(typeof(Storage) !== "undefined"){
			sessionStorage.collapseDefault = 0;
		}
	}
	mobCheckSidebar(collapseDefault);
}

function mobCheckSidebar(collapsevisible){
	if(!($('#top-header').is(':hidden')))
	{
		sidebar(1,collapsevisible);
	}else{
		sidebar(0,collapsevisible);
	}

}

function sidebar(mob,hide){
	$(".sidebar").hide("slide",{direction:'left'});
	$(".collapse-sidebar").hide("slide",{direction:'left'});
	if(mob==0 && hide == 0){
		$(".main-sidebar").show("slide");
		$(".ffa-container").animate({"margin-left":"230px"});
		$(".ff-brand").animate({"width":"230px"});
		$(".ff-brand-bars").animate({"margin-left":"245px"});
		$(".ff-brand").html("<center><span><b>Food</b><span style='color:#fff; font-family: \'Varela Round\', sans-serif;'><b>Fire</b></span></center>")
	}else if(mob==0 && hide == 1){
		$(".ffa-container").animate({"margin-left":"50px"});
		$(".collapse-sidebar").show("slide");
		$(".ff-brand").animate({"width":"50px"});
		$(".ff-brand-bars").animate({"margin-left":"65px"});
		$(".ff-brand").html("<center><span><b>F</b><span style='color:#fff; font-family: \'Varela Round\', sans-serif;'><b>F</b></span></center>")
	}else if(mob==1 && hide == 0){
		$(".main-sidebar").show("slide");
		// $(".ffa-container").animate({"margin-left":"230px"});
		$(".ffa-container").hide();
	}else if(mob==1 && hide == 1){
		$(".ffa-container").show();
		$(".ffa-container").animate({"margin-left":"0px"});
	}
}