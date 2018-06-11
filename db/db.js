const Sequelize = require('sequelize');
const sequelize = require('./sequelize');
const Op = Sequelize.Op;

// load models
var models = [
    'cf_area',
    'cf_category',
    'cf_category_sequence',
    'cf_city',
    'cf_country',
    'cf_data',
    'cf_items',
    'cf_payment',
    'cf_state',
    'cus_address',
    'cart',
    'cus',
    'identity',
    'items',
    'map',
    'order_details',
    'order',
    'rate',
    'recent_activity',
    'reviews',
    'search',
    'sessions',
    'subitems',
    'vendor_time',
    'vendor',
    'promo'
];
models.forEach(function(model) {
    module.exports[capitalizeFirstLetter(model)] = require(__dirname + '/../models/' + model)(sequelize, Sequelize);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports.sequelize = sequelize;
module.exports.Op = Op;