//LIBRARY
let _ = require('lodash');
let moment = require('moment');
moment().tz("America/Los_Angeles").format();
//HELPERS
let response = require('../helper/response');
let logger = require('../middleware/winston').logger;
let common = require('../helper/common');
let cart = require('./cart');

//DB
let DB = require('../db/db');

exports.placeOrder = function (req, res) {
    logger.info("Order ::: PlacaeOrder");
    logger.info(req.session.userAuthenticated);
    if (req.session.userAuthenticated) {
        let total = req.body.total;
        let promo = req.body.promo_code;
        let addunkid = req.body.addunkid;
        let paymentunkid = req.body.paymentunkid;

        logger.info(total);
        logger.info(promo);

        let error = false;
        if (common.isEmpty(total)) {
            sendData = {
                "alert": 1,
                "alertMessage": "Something Went Wrong, Please Refresh And Try Again",
                "alertType": "danger"
            };
            error = true;
        } else if (common.isEmpty(addunkid)) {
            sendData = {
                "alert": 1,
                "alertMessage": "Please Select Your Delivery Address",
                "alertType": "danger"
            };
            error = true;
        } else if (common.isEmpty(paymentunkid)) {
            sendData = {
                "alert": 1,
                "alertMessage": "Please Select Payment Method",
                "alertType": "danger"
            };
            error = true;
        }

        if (error) {
            //Create alert and send back
            response.error(sendData, function (returnData) {
                res.send(returnData);
            });
        } else {
            cart.findCart(req, cartData => {
                cartData = JSON.parse(cartData);
                if(promo && promo !== null){
                    cart.findPromo(req, promoDetails => {
                        promoDetails = JSON.parse(promoDetails);
                        evaluateCart(req, cartData, total, promo, promoDetails, addunkid, paymentunkid).then(returnData => {
                            logger.info(returnData);
                            res.send(returnData);
                        }).catch(error => {
                            logger.error(error);
                        });
                    }, error => {
                        logger.error(error);
                    });
                } else {
                    evaluateCart(req, cartData, total, promo, null, addunkid, paymentunkid).then(returnData => {
                        logger.info(returnData);
                        res.send(returnData);
                    }).catch(error => {
                        logger.error(error);
                    });
                }
            }, error => {
                logger.error(error);
            });
        }
    } else {
        response.error({alert: 1, alertType: 'danger', alertMessage: "Please Sign In"}, returnData => {
            res.send(returnData);
        })
    }
}

const evaluateCart = function (req, cartInfo, totalValue, promo, promoDetails, addunkid, paymentunkid) {
    logger.info("Order ::: evaluateCart");
    logger.info(JSON.stringify(promoDetails));
    return new Promise((resolve, reject) => {
        try{
            DB.sequelize.query("select get_nextid('order') as id;").then(nextId => {
                let orderunkid = nextId[0][0].id;
                let order = new DB.Order();
                order.orderunkid = orderunkid;
                order.cusunkid = req.session.user.cusunkid;
                order.addunkid = addunkid;
                order.paymentunkid = paymentunkid;
                order.order_date = moment().format("YYYY-MM-DD HH:mm:ss");

                order.save().then(() => {
                    let totalAmount = 0;
                    let totalTax = 0;
                    // Change loop with vendorid as a key
                    cartInfo = _.groupBy(cartInfo, 'vendorunkid');

                    let delivery_time = 0;
                    logger.info(JSON.stringify(cartInfo));
                    let insertOrderDetails = [];
                    _.forEach(cartInfo, function(items, vendorId){
                        let vendor_qty = 0;
                        let vendor_total = 0;
                        // Find total delivery time
                        delivery_time += parseFloat(cartInfo[vendorId][0].del_time);

                        for(let i = 0; i < items.length; i++){
                            let item_total_price = parseFloat(parseFloat(items[i].price) * parseFloat(items[i].qty));
                            vendor_qty += parseFloat(items[i].qty);
                            if(items[i].extraItems){
                                for(let j = 0; j < items[i].extraItems.length; j++){
                                    if(items[i].extraItems[j].item_price != null){
                                        item_total_price += parseFloat(items[i].extraItems[j].item_price);
                                    }
                                }
                            }
                            vendor_total += item_total_price;

                            //Insert into order details
                            let orderDetailObj = new DB.Order_details();
                            orderDetailObj.orderunkid = orderunkid;
                            orderDetailObj.itemid = items[i].itemid;
                            orderDetailObj.price = item_total_price;
                            orderDetailObj.qty = items[i].qty;
                            orderDetailObj.food_diet = items[i].food_diet;
                            orderDetailObj.food_taste = items[i].food_taste;
                            orderDetailObj.extra = items[i].extra;

                            insertOrderDetails.push(insertOrderDetail(orderDetailObj));
                        }
                        let tax = cartInfo[vendorId][0].tax;
                        // Calculate tax
                        if(tax && !isNaN(tax)){
                            totalTax += parseFloat(vendor_total * parseFloat(tax)) / 100;
                        }

                        totalAmount += vendor_total;

                    });
                    let toatalRestaurants = _.size(cartInfo);

                    //Calculate delivery charge
                    let delivery_charge = 0;
                    if(toatalRestaurants == 1){
                        delivery_charge = 25;
                    } else {
                        delivery_charge = parseInt((25 * toatalRestaurants)/1.5);
                    }

                    //Calculate discount
                    let discount = 0;
                    if(promoDetails && promoDetails.message && promoDetails.message.discount_type && promoDetails.message.discount){
                        if(promoDetails.message.discount_type == 5){
                            discount = promoDetails.message.discount;
                        } else {
                            discount = parseFloat((totalAmount * promoDetails.message.discount) / 100).toFixed(2);
                        }
                    }
                    logger.info(totalAmount);
                    logger.info(delivery_charge);
                    logger.info(totalTax);
                    logger.info(discount);
                    let grand_total = parseFloat(totalAmount + delivery_charge + totalTax - discount);
                    logger.info(grand_total);
                    // Makes sure grand total is same
                    if((grand_total + 2) > parseInt(totalValue) && (grand_total - 2) < parseInt(totalValue)){
                        Promise.all(insertOrderDetails).then(() => {
                            // Update Order Info
                            order.total = totalAmount;
                            order.grand_total = grand_total;
                            order.delivery_charge = delivery_charge;
                            order.tax = totalTax;
                            order.discount = discount;
                            order.promo = promo;

                            order.save().then(() => {
                                DB.Cart.destroy({where: {cusunkid: req.session.user.cusunkid}}).then(() => {
                                    let message = {
                                        status: 'success',
                                        orderunkid
                                    }
                                    response.create({message}, (returnData) => {
                                        resolve(returnData);
                                    })
                                })
                            })
                        });
                    } else {
                        let sendData = {
                            "alert": 1,
                            "alertType": 'danger',
                            "alertMessage": "Something went wrong with your grand total"
                        }
                        response.error(sendData, returnData => {
                            resolve(returnData);
                        })
                    }
                }).catch(error => {
                    reject(error);        
                });;
            });
        }catch(error){
            reject(error);
        }
    });
}

const insertOrderDetail = function (orderDetail){
    return new Promise((resolve, reject) => {
        orderDetail.save().then(() => {
            resolve();
        }).catch(error => {
            reject(error);
        })
    });
}