//LIBRARY
var _ = require('lodash');
//HELPERS
var alert = require('../helper/alert');
var logger = require('../middleware/winston').logger;

//DB
var DB = require('../db/db');

exports.index = function (req, res){
    try{
        logger.info("Restaurant page ::: Function: index");

        // Queries
        var restaurants_query = "SELECT DISTINCT v.*, IFNULL(l.likes, 0) as likes, r.ratings, IFNULL(f.favorites, 0) as favorites, IFNULL(vi.visits, 0) as visits, IFNULL(vo.votes, 0) as votes, DATEDIFF(NOW(),v.createdAt) as born FROM vendor v";
        var likes = " (select vendorunkid, COUNT(*) as likes from rate where code_id=1 group by vendorunkid) as l ON v.vendorunkid = l.vendorunkid";
        var rating = " (select vendorunkid, ROUND(AVG(rate), 1) as ratings from rate where code_id=2 group by vendorunkid) as r ON v.vendorunkid = r.vendorunkid";
        var favorite = " (select vendorunkid, COUNT(*) as favorites from rate where code_id=3 group by vendorunkid) as f ON v.vendorunkid = f.vendorunkid";
        var visit = " (select vendorunkid, COUNT(*) as visits from rate where code_id=4 group by vendorunkid) as vi ON v.vendorunkid = vi.vendorunkid";
        var votes = " (select vendorunkid, COUNT(*) as votes from rate where code_id=5 group by vendorunkid) as vo ON v.vendorunkid = vo.vendorunkid";

        var where = " where v.isactive = 1 and v.vendor_url ='"+req.params.vendor_url+"' order by v.vendor_name";
        var final_query = restaurants_query + " LEFT JOIN " + likes + " LEFT JOIN " + rating + " LEFT JOIN " + favorite + " LEFT JOIN " + visit + " LEFT JOIN " + votes + where;


        // logger.info(final_query);
        DB.sequelize.query(final_query, { type: DB.sequelize.QueryTypes.SELECT }).then(restaurant => {
            // res.send(JSON.stringify(restaurants));
            var sendData = {
                'user': req.session.user,
                'userAuthenticated': req.session.userAuthenticated,
                'restaurant': restaurant[0],
                'csrfToken': req.csrfToken()
            }

            //Add entry into recent activity table
            $auth = 0;
            // CHECK LOGIN OR NOT
            var cusname = "a new customer";
            if(req.session.userAuthenticated){
                cusname = req.session.user.username;
            }
            var recentActivity = new DB.Recent_activity();
            recentActivity.vendorunkid = restaurant[0].vendorunkid;
            recentActivity.cusname = cusname;

            recentActivity.save().then(() => {
                // logger.info(req.session.user.username);
                res.render('restaurant', sendData);
            });
        });
        
    } catch (ex){
        logger.error("Something went wrong to restaurant page: " + ex);
        // Display error page
    };
}

exports.restaurantsProducts = function(req, res){
    try{
        logger.info("Restaurant page ::: Function: restaurantProducts");

        var vendor_url = req.body.vendor_url;

        var productsQuery = "SELECT i.*, ci.name, cc.name as categoryname, cc.categoryunkid FROM items i LEFT JOIN cf_items ci ON i.itemunkid = ci.itemunkid LEFT JOIN cf_category cc ON ci.categoryunkid = cc.categoryunkid LEFT JOIN cf_category_sequence ccs ON ccs.categoryunkid = ci.categoryunkid LEFT JOIN vendor v ON v.vendorunkid = i.vendorunkid WHERE v.vendor_url = '" + vendor_url +"' AND i.isactive = 1 AND i.isavailable = 1 ORDER BY ccs.sequence";
        DB.sequelize.query(productsQuery, { type: DB.sequelize.QueryTypes.SELECT }).then(products => {
            // logger.info(products);
            var products = _.groupBy(products, "categoryname");
            res.send(JSON.stringify(products));
        });
    } catch (ex){
        logger.error("Something went wrong to provide restaurantProducts: " + ex);
        // Display error page
    };
}

exports.getItem = function (req, res){
    try{
        logger.info("Restaurant page ::: Function: getItem");

        var product_id = req.body.product_id;

        var product_query = "SELECT * FROM items i LEFT JOIN cf_items ci ON i.itemunkid = ci.itemunkid WHERE i.id="+product_id;

        DB.sequelize.query(product_query, { type: DB.sequelize.QueryTypes.SELECT }).then(product => {
            product = product[0];

            product.food_diet = product.food_diet.split(',');
            product.food_taste = product.food_taste.split(',');

            var sub_item_query = "SELECT * FROM subitems WHERE itemid="+product_id;
            DB.sequelize.query(sub_item_query, { type: DB.sequelize.QueryTypes.SELECT }).then(subItems => {
                var subItems = _.groupBy(subItems, function(value){
                    return value.category.toLowerCase();
                });
                var sendData = {
                    product, subItems
                };
                res.send(JSON.stringify(sendData));
            });
        });
    } catch (ex){
        logger.error("Something went wrong to provide product information: " + ex);
        // Display error page
    };
}