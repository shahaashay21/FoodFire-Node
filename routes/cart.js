//LIBRARY
var _ = require('lodash');
//HELPERS
var alert = require('../helper/alert');
var logger = require('../middleware/winston').logger;

//DB
var DB = require('../db/db');

exports.add = function (req, res){
    logger.info("Cart page ::: Function: add");

    // Get all the items
    var itemid = req.body.itemid;
    var qty = req.body.qty;
    var food_diet = req.body.food_diet;
    var food_taste = req.body.food_taste;

    var extra = Array();

    // Get category of each item
    var extra_query = "SELECT distinct(category) FROM subitems WHERE itemid = " + itemid;
    DB.sequelize.query(extra_query, { type: DB.sequelize.QueryTypes.SELECT }).then(extraCategory => {
        _.forEach(extraCategory, function(category){
            var currentCategoryValues = req.body[category.category.toLowerCase()];
            if(currentCategoryValues != undefined && currentCategoryValues != ""){
                var valuesString = currentCategoryValues.toString();
                extra.push(valuesString);
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
    var cart = {
        itemid, qty, food_diet, food_taste, extra    
    };
    var isItemExist = false;
    var sessionCart = req.session.cart;
    if(sessionCart != undefined && sessionCart != ""){
        logger.info("Have something");
        logger.info(sessionCart);
        // Take previously items and add them into the cart
        sessionCart.forEach(function(item){
            if(item.itemid == itemid && item.food_diet == food_diet && item.food_taste == food_taste && isSameArray (item.extra, extra)){
                item.qty = parseInt(item.qty) + parseInt(qty);
                isItemExist = true;
            }
        });
        if(!isItemExist){
            req.session.cart.push(cart);
        }
    } else {
        req.session.cart = [cart];
    }
    callback(false);
}

function showSession (req,callback){
    logger.info(req.session.cart);
    callback();
}

exports.logSession = function (req, res) {
    req.session.cart = "";
    showSession(req, function(){
        res.send();
    })
}

function isSameArray (array1, array2){
    if(array1.length < array2.length){
        var tempArray = array1;
        array1 = array2;
        array2 = tempArray;
    }
    for (var i = 0; i<array1.length; i++){
        if(array1[i] != array2[i]){
            return false;
        }
    }
    return true;
}