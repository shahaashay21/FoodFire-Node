//LIBRARY
let _ = require('lodash');
//HELPERS
let alert = require('../helper/alert');
let logger = require('../middleware/winston').logger;
let common = require('../helper/common');

//DB
let DB = require('../db/db');

// Send cities name
exports.getcities = function (req, res){
    logger.info("Address ::: getcities");
    DB.Cf_city.findAll({attributes: ['cityunkid', 'city_name']}).then(cities => {
        res.send(JSON.stringify(cities));
    });
}

// Send areas name based on city id
exports.getareas = function (req, res){
    logger.info("Address ::: getareas");
    let cityunkid = req.body.city;
    logger.info(cityunkid);
    DB.Cf_area.findAll({where: {cityunkid: cityunkid}, attributes: ['areaunkid', 'area_name']}).then(areas => {
        res.send(JSON.stringify(areas));
    });
    // var query = "SELECT areaunkid, area_name FROM cf_area WHERE cityunkid="+cityunkid;
    // logger.info(query);
    // DB.sequelize.query(query, {type: DB.sequelize.QueryTypes.SELECT}).then(areas => {
    //     res.send(JSON.stringify(areas));
    // });
}

exports.addAddress = function(req, res){
    logger.info("Address ::: addAddress");

    let name = req.body.add_name;
    let address = req.body.add_address;
    let cityid = req.body.add_city;
    let areaid = req.body.add_area;
    let pincode = req.body.add_pincode;

    if (req.session.userAuthenticated) {
        let error = false;
        if (common.isEmpty(name)) {
        sendData = {
            "type": "danger",
            "message": "Name field should not be empty."
        };
        error = true;
        } else if (common.isEmpty(address)) {
        sendData = {
            "type": "danger",
            "message": "Address field should not be empty."
        };
        error = true;
        } else if (common.isEmpty(cityid) || isNaN(cityid)) {
        sendData = {
            "type": "danger",
            "message": "Please select your city."
        };
        error = true;
        } else if (common.isEmpty(areaid) || isNaN(areaid)) {
        sendData = {
            "type": "danger",
            "message": "Please select your area."
        };
        error = true;
        } else if (common.isEmpty(pincode) || isNaN(pincode)) {
            sendData = {
            "type": "danger",
            "message": "Pincode field should not be empty and must be numeric."
            };
            error = true;
        }
        if (error) {
        //Create alert and send back
        alert.alertResponse(sendData, function (errorData) {
            res.send(JSON.stringify(errorData));
        });
        } else {
            // Add address into the DB
            DB.sequelize.query("select get_nextid('cus_address') as id;").then(nextId => {
                let userAddress = new DB.Cus_address();
                userAddress.addunkid = nextId[0][0].id;
                userAddress.cusunkid = req.session.user.cusunkid;
                userAddress.name = name;
                userAddress.address = address;
                userAddress.area = areaid;
                userAddress.city = cityid;
                userAddress.pincode = pincode;

                userAddress.save().then(() => {
                    res.end('Added');
                }).catch(ex => {
                    logger.error("Error in saving user's address: " + ex);
                    res.end('err');
                });
            });

        }
    } else {
        res.send("Please sign in to add an address");
    }
}

exports.getAddress = function (req, res){
    logger.info("Address ::: getAddress");
    try{
        if (req.session.userAuthenticated) {
            let query = "SELECT "+
                    "cusa.*, "+
                    "cfar.area_name, "+
                    "cfci.city_name, "+
                    "cfst.state_name, "+
                    "cfcn.country_name "+
                "FROM "+
                    "cus_address cusa "+
                        "LEFT JOIN "+
                    "cf_area cfar ON cusa.area = cfar.areaunkid "+
                        "LEFT JOIN "+
                    "cf_city cfci ON cfar.cityunkid = cfci.cityunkid "+
                        "LEFT JOIN "+
                    "cf_state cfst ON cfci.stateunkid = cfst.stateunkid "+
                        "LEFT JOIN "+
                    "cf_country cfcn ON cfst.countryunkid = cfcn.countryunkid "+
                "WHERE "+
                    "cusa.cusunkid = "+req.session.user.cusunkid;

            DB.sequelize.query(query, {type: DB.sequelize.QueryTypes.SELECT}).then(addresses => {
                if(addresses.length > 0){
                    res.send(JSON.stringify(addresses));
                } else {
                    res.send("No address found");
                }
            }, (ex) => {
                logger.error(ex);
            });
        } else {
            res.send("Please sign in to get an address");
        }
    } catch(ex){
        logger.error("Error to get address");
        logger.error(ex);
    }
}