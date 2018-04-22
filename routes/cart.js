//LIBRARY
var _ = require('lodash');
//HELPERS
var alert = require('../helper/alert');
var logger = require('../middleware/winston').logger;

//DB
var DB = require('../db/db');

exports.add = function (req, res){
    logger.info("Cart page ::: Function: add");

    var itemid = req.body.itemid;
    var qty = req.body.qty;
    var food_diet = req.body.food_diet;
    var food_taste = req.body.food_taste;

    // logger.info("Item id: " + itemid);
    // logger.info("Item qty: " + qty);
    // logger.info("Item food_diet: " + food_diet);
    // logger.info("Item food_taste: " + food_taste);

    var extra = Array();

    var extra_query = "SELECT distinct(category) FROM subitems WHERE itemid = " + itemid;
    DB.sequelize.query(extra_query, { type: DB.sequelize.QueryTypes.SELECT }).then(extraCategory => {
        _.forEach(extraCategory, function(category){
            var currentCategoryValues = req.body[category.category.toLowerCase()];
            if(currentCategoryValues != undefined && currentCategoryValues != ""){
                var valuesString = currentCategoryValues.toString();
                extra.push(valuesString);
                // logger.info(valuesString);
            }
        });
        addSession(req, itemid, qty, food_diet, food_taste, extra, function(error){
            showSession(req, function(){
                res.send("success");
            });
        });
    });
};

function addSession (req, itemid, qty, food_diet, food_taste, extra, callback){
    req.session.cart = "";
    var cart = [{
        itemid, qty, food_diet, food_taste, extra    
    }];
    var sessionCart = req.session.cart;
    if(sessionCart != undefined && sessionCart != ""){
        // Take previously added cart information and then add
        
    } else {
        req.session.cart = cart;
    }
    callback(false);
}

function showSession (req,callback){
    logger.info(req.session.cart);
    callback();
}

exports.logSession = function (req, res) {
    showSession(req, function(){
        res.send();
    })
}