//LIBRARY
let _ = require('lodash');
let moment = require('moment');
moment().tz("America/Los_Angeles").format();
//HELPERS
let response = require('../helper/response');
let logger = require('../middleware/winston').logger;
let common = require('../helper/common');

//DB
let DB = require('../db/db');

/*** ADD AN ITEM INTO THE CART (DB or SESSION CART)***/
exports.addCart = function (req, res) {
    logger.info("Cart ::: addCart");
    // Get all the items
    let error = false;
    let itemid = req.body.itemid;
    if(!common.isEmpty(itemid) && isNaN(itemid)) error = true;
    let qty = req.body.qty;
    if(!common.isEmpty(qty) && isNaN(qty)) error = true;
    let food_diet = req.body.food_diet;
    let food_taste = req.body.food_taste;

    if(!error){
        let extra = Array();
        // Get category of each item to get the item from data
        let extra_query = "SELECT distinct(category) FROM subitems WHERE itemid = " + itemid;
        DB.sequelize.query(extra_query, { type: DB.sequelize.QueryTypes.SELECT }).then(extraCategory => {
            _.forEach(extraCategory, function (category) {
                let currentCategoryValues = req.body[category.category.toLowerCase()];
                if (currentCategoryValues != undefined && currentCategoryValues != "") {
                    let valuesString = currentCategoryValues.toString();
                    extra.push(valuesString);
                }
            });
            extra.sort();
            extra = extra.toString();

            // First add all the items into the session
            addIntoSession(req, itemid, qty, food_diet, food_taste, extra)
                .then(() => {
                    return addCartIntoDb(req);
                }).then(result => {
                    return showSession(req);
                }).then(() => {
                    res.send("success");
                }).catch(() => {
                    res.send("error");
                });
        });
    } else {
        res.send("error");
    }
};

exports.getCart = function (req, res) {
    logger.info("Cart ::: getCart");
    findCart(req, cartDetails => {
        res.send(cartDetails);
    })
}

/*** Getting cart items ***/
const findCart = function (req, callback) {
    logger.info("Cart ::: findCart");

    getCartDetails(req)
        .then(cart => {
            if (!common.isEmpty(cart)) {
                let vendorPromises = [];
                let extraPromises = [];
                cart.forEach(function(item){
                    vendorPromises.push(getItemsAndVendorInfo(item.itemid));
                });
                Promise.all(vendorPromises).then((vendorsItems) => {
                    for(let i=0; i<cart.length; i++){
                        extraPromises.push(getExtraItemInfo(cart[i].itemid, cart[i].extra));
                    }
                    Promise.all(extraPromises).then(extraItemsInfo => {
                        // Add everything cart array
                        let cartDetails = {};
                        let returnCart = [];
                        for(let i=0; i<cart.length; i++){
                            let merged = cart[i];
                            merged = _.merge(merged, vendorsItems[i]);
                            merged.extraItems = extraItemsInfo[i];
                            returnCart.push(merged);
                        }
                        callback(JSON.stringify(returnCart));
                    });
                });
            } else {
                callback();
            }
        }).catch(ex => {
            logger.error(ex);
            callback("error");
        });
};

exports.applyPromo = function (req, res){
    logger.info("Cart ::: findPromo");
    findPromo(req, promoResult => {
        res.send(promoResult);
    });

}
const findPromo = function (req, callback) {
    logger.info("Cart ::: applyPromo");

    let promoCode = req.body.promo_code;

    if(promoCode && promoCode != ''){
        DB.Promo.findOne({where: {code: promoCode}}).then(promoDetails => {
            // promoDetails = promoDetails.dataValues
            // logger.info(promoDetails.dataValues);
            if(promoDetails){
                DB.Order.findOne({where: {promo: promoDetails.code, cusunkid: req.session.user.cusunkid}}).then(promoOrder => {
                    if(promoDetails.multiple == 0 && promoOrder !== null){
                        let message = "Sorry! You have already used it.";
                        let sendMessage = {
                            promo_code: message
                        }
                        response.error({message: sendMessage}, returnData => {
                            callback(returnData);
                        });
                    } else {
                        let message = {
                            discount_type: promoDetails.discount_type,
                            discount: promoDetails.discount
                        }
                        let returnMessage = {
                            alert: 1,
                            alertType: 'success',
                            alertMessage: promoDetails.message,
                            message
                        }
                        response.create(returnMessage, returnData => {
                            callback(returnData);
                        })
                    }
                });
            } else {
                let message = "Coupon code '"+promoCode+"' is not valid";
                let sendMessage = {
                    promo_code: message
                }
                response.error({message: sendMessage}, returnData => {
                    callback(returnData);
                });
            }
        });
    } else {
        response.error({}, returnData => {
            callback(returnData);
        })
    }
}

/*** Deleting cart item ***/
exports.deleteCartItem = function (req, res) {
    logger.info("Cart ::: deleteCartItem");

    let error = false;
    var cartid = req.body.cartid;
    if(common.isEmpty(cartid) || isNaN(cartid)) error = true;

    if(!error){
        if (req.session.userAuthenticated) {
            // Delete it from a DB
            DB.Cart.destroy({where: {cartid : cartid}}).then(deleted => {
                res.send("success");
            });
        } else {
            // Delete it from a session cart
            let sessionCart = req.session.cart;
            let newSessionCart = [];
            if (sessionCart != undefined && sessionCart != "") {
                sessionCart.forEach(function (item) {
                    if (item.cartid != cartid) {
                        newSessionCart.push(item);
                    }
                });
            }
            req.session.cart = newSessionCart;
            res.send("success");
        }
    } else {
        res.send("error");
    }
}

/*** Updating cart item ***/
exports.updateCartItem = function (req, res){
    logger.info("Cart ::: updateCartItem");

    let error = false;
    let cartid = req.body.cartid;
    let qty = req.body.qty;
    if(common.isEmpty(cartid) || isNaN(cartid)) error = true;
    if(common.isEmpty(qty) || isNaN(qty)) error = true;

    if(!error){
        if (req.session.userAuthenticated) {
            // Update it from a DB
            DB.Cart.update({qty: qty},{where: {cartid : cartid}}).then(deleted => {
                res.send("success");
            });
        } else {
            // Update it from a session cart
            let sessionCart = req.session.cart;
            let newSessionCart = [];
            if (sessionCart != undefined && sessionCart != "") {
                sessionCart.forEach(function (item) {
                    if (item.cartid == cartid) {
                        item.qty = qty;
                    }
                    newSessionCart.push(item);
                });
            }
            req.session.cart = newSessionCart;
            res.send("success");
        }
    } else {
        res.send("error");
    }
}

const getItemsAndVendorInfo = function (itemId) {
    logger.info("Cart ::: getVendorInfo");
    try{
        return new Promise((resolve, reject) => {
            let query = "SELECT ci.name as itemname, i.price as price, v.vendor_name, v.vendor_fullurl, v.vendorunkid, v.tax, v.del_time FROM items i LEFT JOIN vendor v ON i.vendorunkid = v.vendorunkid LEFT JOIN cf_items ci ON ci.itemunkid = i.itemunkid WHERE i.id=" + itemId;
            DB.sequelize.query(query, {type: DB.sequelize.QueryTypes.SELECT}).then(vendorInfo => {
                resolve(vendorInfo[0]);
            });
        });
    }catch(ex){
        reject(ex);
    }
}

const getExtraItemInfo = function (itemId, extra) {
    logger.info("Cart ::: getExtraItemInfo");
    try{
        return new Promise((resolve, reject) => {
            if(common.isEmpty(extra)){
                resolve();
            } else {
                let query = "SELECT subitemid, item_name, item_price FROM subitems WHERE itemid = "+ itemId +" AND subitemid IN ("+ extra +")";
                DB.sequelize.query(query, {type: DB.sequelize.QueryTypes.SELECT}).then(itemInfo => {
                    resolve(itemInfo);
                });
            }
        });
    }catch(ex){
        reject(ex);
    }
}

/*** Send cart items based on user checked in or not ***/
const getCartDetails = (req) => {
    logger.info("Cart ::: getCartDetails");
    return new Promise((resolve, reject) => {
        try {
            if (req.session.userAuthenticated) {

                // Make sure, session cart should be in db
                addCartIntoDb(req)
                    .then(result => {
                        // Get cart information from DB
                        let query = "SELECT * FROM cart WHERE cusunkid=" + req.session.user.cusunkid;
                        DB.sequelize.query(query, { type: DB.sequelize.QueryTypes.SELECT }).then(userCart => {
                            resolve(userCart);
                        });
                    }).catch(() => {
                        logger.error("Getting an error");
                        reject("Error");
                    });
            } else {
                // Get cart details from session and return it
                let sessionCart = req.session.cart;
                if (sessionCart == null || sessionCart == "") sessionCart = "";
                resolve(sessionCart);
            }
        } catch (e) {
            reject(e);
        }
    });
}

/*** ADD AN ITEM INTO THE SESSION CART ***/
function addIntoSession(req, itemid, qty, food_diet, food_taste, extra, callback) {
    logger.info("Cart ::: addIntoSession");
    return new Promise((resolve, reject) => {
        let cartid = moment().valueOf();
        let cart = {
            cartid, itemid, qty, food_diet, food_taste, extra
        };
        let isItemExist = false;
        let sessionCart = req.session.cart;
        if (sessionCart != undefined && sessionCart != "") {
            // Take previously items and add them into the cart
            sessionCart.forEach(function (item) {
                if (item.itemid == itemid && item.food_diet == food_diet && item.food_taste == food_taste && item.extra == extra) {
                    item.qty = parseInt(item.qty) + parseInt(qty);
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                req.session.cart.push(cart);
                logger.info("Item added into the session cart");
            }
        } else {
            req.session.cart = [cart];
        }
        resolve();
    });
}

/*** MOVE SESSION CART INTO THE DB IF USER IS ALREADY LOGGED IN ***/
function addCartIntoDb(req) {
    logger.info("Cart ::: addCartIntoDb");
    return new Promise((resolve, reject) => {
        if (req.session.userAuthenticated) {
            // User is already logged in.... Insert into database
            // Move session items into the DB and clear the session cart
            let sessionCart = [];
            sessionCart = req.session.cart;
            req.session.cart = null; // Empty session cart
            let userCartQuery = "SELECT * FROM cart WHERE cusunkid=" + req.session.user.cusunkid;
            // DB.sequelize.query(userCartQuery, { type: DB.sequelize.QueryTypes.SELECT }).then(userCart => {
            DB.Cart.findAll({where: {cusunkid: req.session.user.cusunkid}}).then(userCart => {
                if (sessionCart != null && sessionCart != "") {
                    logger.info("Something to add into DB");
                    sessionCart.forEach(function (item) {
                        let isItemExist = false;
                        userCart.forEach(function (userItem) {
                            if (userItem.itemid == item.itemid && userItem.food_diet == item.food_diet && userItem.food_taste == item.food_taste && userItem.extra == item.extra) {
                                // Update qty of an item into DB
                                let newQty = parseInt(userItem.qty) + parseInt(item.qty);
                                let updateItemQuery = "UPDATE cart set qty=" + newQty + " WHERE cusunkid=" + req.session.user.cusunkid + " and " +
                                    "itemid=" + userItem.itemid + " and " +
                                    "food_diet='" + userItem.food_diet + "' and " +
                                    "food_taste='" + userItem.food_taste + "' and " +
                                    "extra='" + userItem.extra + "'";
                                logger.info(updateItemQuery);
                                DB.sequelize.query(updateItemQuery).spread((results, metadata) => { });
                                isItemExist = true;
                            }
                        });
                        if (!isItemExist) {
                            // Add item into the DB
                            let newCartItem = new DB.Cart();
                            newCartItem.cusunkid = req.session.user.cusunkid;
                            newCartItem.itemid = item.itemid;
                            newCartItem.qty = item.qty;
                            newCartItem.food_diet = item.food_diet;
                            newCartItem.food_taste = item.food_taste;
                            let extraArray = item.extra.toString();
                            newCartItem.extra = extraArray;
                            newCartItem.save().then(() => { });
                        }
                    });
                }
                resolve(true);
            });
        } else resolve(true);
    })
}

/*** Update(increase) cart qty by checking that if it is available in cart or not ***/
// function updateItemQty (userItem, cartItem){
//     return new Promise((resolve, reject) => {

//     });
// }

function showSession(req) {
    logger.info("Cart ::: showSession");
    return new Promise((resolve, reject) => {
        if (req.session.userAuthenticated) {
            let userCartQuery = "SELECT * FROM cart WHERE cusunkid=" + req.session.user.cusunkid;
            DB.sequelize.query(userCartQuery, { type: DB.sequelize.QueryTypes.SELECT }).then(userCart => {
                logger.info(userCart);
                resolve();
            });
        } else {
            logger.info(req.session.cart);
            resolve();
        }
    });
}

/*** NOT USING ***/
// Check if cart "extra" data is same or not 
function isSameArray(array1, array2) {
    logger.info("Cart ::: isSameArray");
    if ((array1.length == 0) && array2.length == 0) return true;
    if (array1.length < array2.length) {
        let tempArray = array1;
        array1 = array2;
        array2 = tempArray;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
}



// TEMPORARY
exports.logSession = function (req, res) {
    logger.info("Cart ::: logSession");
    req.session.cart = "";
    showSession(req)
        .then(() => {
            // logger.info(req.session);
            if(typeof req.session.userAuthenticated != "undefined" && req.session.userAuthenticated){
                DB.Cart.destroy({where: {'cusunkid': req.session.user.cusunkid}}).then(() => {
                    res.send();
                });
                // DB.Cart.findAll({where: {cusunkid: req.session.user.cusunkid}}).then(userCart => {
                //     logger.info("Something");
                //     logger.info(userCart);
                // });
            } else {
                res.send();
            }
        });
}


exports.findCart = findCart;
exports.findPromo = findPromo;