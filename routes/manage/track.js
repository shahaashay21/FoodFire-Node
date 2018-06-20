//LIBRARY
let _ = require('lodash');
let path = require('path');
//HELPERS
let response = require('../../helper/response');
let logger = require('../../middleware/winston').logger;
let common = require('../../helper/common');

//DB
let DB = require('../../db/db');

/* GET home page. */
exports.index = function(req, res) {
    logger.info("Track ::: index");
    let sendData = {
        'user': req.session.user,
        'userAuthenticated': req.session.userAuthenticated,
        'csrfToken': req.csrfToken()
    }
    res.render('track', sendData); 
};