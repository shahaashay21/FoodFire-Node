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
    DB.Cf_city.findAll({attributes: ['cityunkid', 'city_name']}).then(cities => {
        res.send(JSON.stringify(cities));
    });
}

// Send areas name based on city id
exports.getareas = function (req, res){
    logger.info(req.body.city);
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