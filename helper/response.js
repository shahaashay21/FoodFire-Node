exports.alertResponse = function(req, callback){
	// console.log("Class errmsg and function wrongwithmessage");
	console.log(req.message);
	var data = {};
	data['modal'] = 1;
	data['alert'] = 1;
	data['error'] = 1;
	data['alertType'] = "alert-notify-"+ req.type;
    data['alertMessage'] = "<b>"+req.message+"</b>";
	callback(JSON.stringify(data));
}

function create (req, callback) {
	var returnData = {};
	returnData.modal = req.modal || 0;
	returnData.error = req.error || 0;
	returnData.message = req.message || "";
	returnData.alert = req.alert || 0;
	returnData.alertType = req.alertType || "";
	returnData.alertMessage = req.alertMessage || "";

	// if(req.modal){
	// 	returnData.modal = req.modal;
	// }
	// if(req.error){
	// 	returnData.error = req.error;
	// }
	// if(req.message){
	// 	returnData.message = req.message;
	// }
	// if(req.alert){
	// 	returnData.alert = req.alert;
	// }
	if(req.alertType){
		returnData.alertType = "alert-notify-"+req.alertType;
	}
	if(req.alertMessage){
		returnData.alertMessage = "<b>"+req.alertMessage+"</b>";
	}

	callback(JSON.stringify(returnData));
}

exports.error = function (req, callback){
	var sendData = {};
	sendData.modal = 1;
	sendData.error = 1;
	sendData.message = req.message || "";
	sendData.alert = req.alert || 0;
	sendData.alertType = req.alertType || "";
	sendData.alertMessage = req.alertMessage || "";
	create(sendData, (returnData) => {
		callback(returnData);
	});
}

exports.create = create;