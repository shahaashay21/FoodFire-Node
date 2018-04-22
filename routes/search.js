//LIBRARY
var _ = require('lodash');
var moment = require('moment');
moment().tz("America/Los_Angeles").format();
//HELPERS
var alert = require('../helper/alert');
var logger = require('../middleware/winston').logger;

//DB
var DB = require('../db/db');

exports.index = function (req, res){
    try{
        logger.info("Search page ::: Function: index");

        var sendData = {
            'user': req.session.user,
            'userAuthenticated': req.session.userAuthenticated,
            'csrfToken': req.csrfToken()
        }
        res.render('search', sendData);

    } catch (ex){
        logger.error("Something went wrong to search page: " + ex);
        // Display error page
    };
} 

exports.getRecentActivity = function (req, res){
    try{
        logger.info("Search page ::: Function: getRecentActivity");

        var recentActivity = "SELECT r.*, v.imgsrc, v.city, v.vendor_url, v.vendor_name FROM recent_activity r LEFT JOIN vendor v on r.vendorunkid = v.vendorunkid order by r.id desc limit 5";
        DB.sequelize.query(recentActivity, { type: DB.sequelize.QueryTypes.SELECT }).then(recent_activity => {
            // var i = 0;
            _.forEach(recent_activity, function(data){
                data.createdAt = moment(data.createdAt+"z").tz('America/Los_Angeles').fromNow();
                // logger.info(day.fromNow());
                // data.createdAt = day.fromNow();
                // i++;
            });
            res.send(JSON.stringify(recent_activity));
        });
    } catch (ex){
        logger.error("Something went wrong to get recentactivity: " + ex);
        // Display error page
    };
}


exports.restaurants = function(req, res){
    try{
        logger.info("Search page ::: Function: restaurants");
        var q = req.body.q;
        logger.info("q: "+q);
        // Queries
        var restaurants_query = "SELECT DISTINCT v.*, IFNULL(l.likes, 0) as likes, r.ratings, IFNULL(f.favorites, 0) as favorites, IFNULL(vi.visits, 0) as visits, IFNULL(vo.votes, 0) as votes, DATEDIFF(NOW(),v.createdAt) as born FROM vendor v";
        var likes = " (select vendorunkid, COUNT(*) as likes from rate where code_id=1 group by vendorunkid) as l ON v.vendorunkid = l.vendorunkid";
        var rating = " (select vendorunkid, ROUND(AVG(rate), 1) as ratings from rate where code_id=2 group by vendorunkid) as r ON v.vendorunkid = r.vendorunkid";
        var favorite = " (select vendorunkid, COUNT(*) as favorites from rate where code_id=3 group by vendorunkid) as f ON v.vendorunkid = f.vendorunkid";
        var visit = " (select vendorunkid, COUNT(*) as visits from rate where code_id=4 group by vendorunkid) as vi ON v.vendorunkid = vi.vendorunkid";
        var votes = " (select vendorunkid, COUNT(*) as votes from rate where code_id=5 group by vendorunkid) as vo ON v.vendorunkid = vo.vendorunkid";

        var where = " where v.isactive = 1 and v.vendor_name like '%"+q+"%' order by v.vendor_name";
        var final_query = restaurants_query + " LEFT JOIN " + likes + " LEFT JOIN " + rating + " LEFT JOIN " + favorite + " LEFT JOIN " + visit + " LEFT JOIN " + votes + where;


        // logger.info(final_query);
        DB.sequelize.query(final_query, { type: DB.sequelize.QueryTypes.SELECT }).then(restaurants => {
            res.send(JSON.stringify(restaurants));
        });
    } catch(ex){
        logger.error("Something went wrong to get recentactivity: " + ex);
    }
}