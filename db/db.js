const Sequelize = require('sequelize');
const sequelize = require('./sequelize');
const Op = Sequelize.Op;


// module.exports.Cf_area = require('../models/cf_area')(sequelize, Sequelize);
// module.exports.Cf_category = require('../models/cf_category')(sequelize, Sequelize);
// module.exports.Cf_city = require('../models/cf_city')(sequelize, Sequelize);
// module.exports.Cf_country = require('../models/cf_country')(sequelize, Sequelize);
// module.exports.Cf_data = require('../models/cf_data')(sequelize, Sequelize);
// module.exports.Cf_items = require('../models/cf_items')(sequelize, Sequelize);
// module.exports.Cf_payment = require('../models/cf_payment')(sequelize, Sequelize);
// module.exports.Cf_state = require('../models/cf_state')(sequelize, Sequelize);

// module.exports.Cf_address = require('../models/cus_address')(sequelize, Sequelize);
// module.exports.Cart = require('../models/cart')(sequelize, Sequelize);
// module.exports.Cus = require('../models/cus')(sequelize, Sequelize);
// module.exports.Identity = require('../models/identity')(sequelize, Sequelize);
// module.exports.Items = require('../models/items')(sequelize, Sequelize);
// module.exports.Map = require('../models/map')(sequelize, Sequelize);
// module.exports.Order_details = require('../models/order_details')(sequelize, Sequelize);
// module.exports.Order = require('../models/order')(sequelize, Sequelize);
// module.exports.Rate = require('../models/rate')(sequelize, Sequelize);
// module.exports.Recent_activity = require('../models/recent_activity')(sequelize, Sequelize);
// module.exports.Reviews = require('../models/reviews')(sequelize, Sequelize);
// module.exports.Search = require('../models/search')(sequelize, Sequelize);
// module.exports.Sessions = require('../models/sessions')(sequelize, Sequelize);
// module.exports.Subitems = require('../models/subitems')(sequelize, Sequelize);
// module.exports.Vendor_time = require('../models/vendor_time')(sequelize, Sequelize);
// module.exports.Vendor = require('../models/vendor')(sequelize, Sequelize);


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
];
models.forEach(function(model) {
    module.exports[capitalizeFirstLetter(model)] = require(__dirname + '/../models/' + model)(sequelize, Sequelize);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports.sequelize = sequelize;
module.exports.Op = Op;