fs = require('fs');

exports.genericInfo = function(req, res, next){
	// console.log(req.connection.remoteAddress);
	var d = new Date();
    var n = d.getMonth()+1 +'-'+ d.getDate() +'-'+ d.getFullYear();
    var dir = 'public/logs';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.open('public/logs/'+ n+'.log', 'a+', function(err, file){
    	
    	var time = d.getHours() +':'+ d.getMinutes() +':'+ d.getSeconds();
    	var host = req.headers.host;
    	var referer = req.headers.referer;
        var ip = req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress ||
                 req.connection.socket.remoteAddress;
    	logData = n+' @ '+ time +' --- IP:'+ ip +' --- Host:'+ host +' --- Referer:'+ referer +'\n';
    	fs.appendFile('public/logs/'+ n+'.log', logData, function (err) {
			next();
		});
    });
}