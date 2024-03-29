//LIBRARY
let _ = require('lodash');
//HELPERS
let response = require('../helper/response');
let logger = require('../middleware/winston').logger;
let common = require('../helper/common');

//DB
let DB = require('../db/db');

/* GET home page. */
exports.index = function(req, res, next) {
    logger.info("Checkout ::: index");
    let sendData = {
        'user': req.session.user,
        'userAuthenticated': req.session.userAuthenticated,
        'csrfToken': req.csrfToken()
    }
    res.render('checkout', sendData);
};