//LIBS
var validator = require('validator');
var bcrypt = require('bcrypt');

//HELPERS
var alert = require('../helper/alert');
var logger = require('../middleware/winston').logger;

//DB
var DB = require('../db/db');

exports.register = function (req, res, next){
  try{
    logger.info("Users page ::: Function: register");
    // Just to check all req information
    // logger.info(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var contact = req.body.mobile;
    var error = false;
    if(email == null || email.length < 1 ||  !validator.isEmail(email)){
      sendData = {
            "type": "danger",
            "message": "Please check your email id."
          };
          error = true;
    }else if(name == null || name.length < 1){
      sendData = {
            "type": "danger",
            "message": "Name field should not empty."
          };
          error = true;
    }else if(contact == null || contact.length < 6 || !validator.isNumeric(contact)){
      sendData = {
            "type": "danger",
            "message": "Mobile must be more than 5 characters and numeric."
          };
          error = true;
    }else if(password == null || password.length < 6){
      sendData = {
            "type": "danger",
            "message": "Password must be more than 5 characters."
          };
          error = true;
    }
    if(error){
      //Create alert and send back
      alert.alertResponse(sendData, function(errorData){
            res.send(JSON.stringify(errorData));
          });
    }else{
      DB.Cus.count({where: {'email': email}}).then(isAvailable => { // Email is available or not
        if(isAvailable){
          //EMAIL ADDRESS IS ALREADY AVAILABLE
          res.end(JSON.stringify('ER'));
        }else{
          bcrypt.hash(password, 5, function(err, hash) {
            DB.sequelize.query("select get_nextid('cus') as id;").then(nextId => {
              var userAccount = new DB.Cus();
              userAccount.cusunkid = nextId[0][0].id;
              userAccount.email = email.toLowerCase();
              userAccount.password = hash;
              userAccount.username = name.toLowerCase();
              userAccount.contact = contact;
              //REGISTER USER ACCOUNT
              userAccount.save().then(() => {
                res.end(JSON.stringify('Registered'));
              }).catch(ex => {
                logger.error("Error in saving new user's details: " + ex);
                res.end(JSON.stringify('err'));
              });
            }).catch(ex => {
              logger.error("Error in getting new cus id: " + ex);
              res.end(JSON.stringify('err'));
            });
          });
        }
      }).catch((ex) => {
        logger.error("Error in registering users: " + ex);
        res.end(JSON.stringify('err'));
      });
    }	
  }catch(ex){
    logger.error("Something went wrong to register new user: " + ex);
    res.end(JSON.stringify('err'));
  }
};


exports.login = function(req, res){
	logger.info("Users page ::: Function: login");
  // Just to check all req information
  // logger.info(req.body);
	var email = req.body.email;
  var password = req.body.password;
	
  DB.Cus.findOne({where: {email: email}, attributes: ['password', 'cusunkid', 'username']
  }).then(user => {
		if(user){
			bcrypt.compare(password, user.password).then(isValid => {
				logger.info("Whether password is valid or not: " + isValid);
				if(isValid){
					user = {'username': user.username, 'cusunkid': user.cusunkid};
					req.session.user = user;
					req.session.userAuthenticated = true;
				 	res.end(JSON.stringify(user)); 
				}else{
					res.end(JSON.stringify('fail'));
				}
			}).catch(ex => {
        logger.error("Error in bcrypt compare with user login: " + ex);
        res.end(JSON.stringify('fail'));
      });
		}else{
			res.end(JSON.stringify('fail'));
		}
	});
};


exports.logout = function(req, res){
  logger.info("Users page ::: Function: logout");
	req.session.userAuthenticated = null;
	req.session.user = null;
	res.json("Logged out");
}
