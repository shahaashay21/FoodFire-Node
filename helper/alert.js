exports.alertResponse = function(req, res){
	// console.log("Class errmsg and function wrongwithmessage");
	console.log(req.message);
	var data = {};
	data['modal'] = 1;
	data['alert'] = 1;
	data['alerttype'] = "alert-notify-"+ req.type;
    data['message'] = "<b>"+req.message+"</b>";
    res(data);
}

exports.validationResponse = function(req, res){
	// console.log("Class errmsg and function wrongwithmessage");
	console.log(req.message);
	var data = {};
	data['modal'] = 1;
	data['msg'] = 1;
    data['message'] = "<b>"+req.message+"</b>";
    res(data);
}