'use strict';
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
var tsFormat = function() {return ((new Date().getFullYear())+'-'+((new Date().getMonth())+1)+'-'+(new Date().getDate())+' '+(new Date()).toLocaleTimeString())};
const logger = new (winston.Logger)({
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/-results.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            handleExceptions: true,
            json: false,
            level: env === 'development' ? 'debug' : 'verbose'
        })
    ]
});

const apiTrackLogger = new (winston.Logger)({
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/-api.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            handleExceptions: true,
            json: false,
            level: env === 'development' ? 'debug' : 'verbose'
        })
    ]
});

exports.genericInfo = function(req, res, next){
	// console.log(req.connection.remoteAddress);
	var d = new Date();
    var n = d.getMonth()+1 +'-'+ d.getDate() +'-'+ d.getFullYear();
    var time = d.getHours() +':'+ d.getMinutes() +':'+ d.getSeconds();
    var host = req.headers.host;
    var referer = req.headers.referer;
    var ip = req.headers['x-forwarded-for'] || 
                req.connection.remoteAddress || 
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    logData = 'IP:'+ ip +' --- Host:'+ host +' --- Referer:'+ referer +'\n';
    
    apiTrackLogger.verbose(logData);
    next();
}

exports.logger = logger;
// logger.debug('Debugging info');
// logger.verbose('Verbose info');
// logger.info('Hello world');
// logger.warn('Warning message');
// logger.error('Error info');