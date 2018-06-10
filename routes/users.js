//LIBS
let validator = require('validator');
let bcrypt = require('bcrypt');

//HELPERS
let alert = require('../helper/alert');
let logger = require('../middleware/winston').logger;
let common = require('../helper/common');

//DB
let DB = require('../db/db');

exports.register = function (req, res, next) {
  try {
    logger.info("Users page ::: Function: register");
    // Just to check all req information
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let contact = req.body.mobile;
    let error = false;
    if (common.isEmpty(email) || !validator.isEmail(email)) {
      sendData = {
        "type": "danger",
        "message": "Please check your email id."
      };
      error = true;
    } else if (common.isEmpty(name)) {
      sendData = {
        "type": "danger",
        "message": "Name field should not be empty."
      };
      error = true;
    } else if (common.isEmpty(contact) || contact.length < 6 || isNaN(contact)) {
      sendData = {
        "type": "danger",
        "message": "Mobile must be more than 5 characters and numeric."
      };
      error = true;
    } else if (common.isEmpty(password) || password.length < 6) {
      sendData = {
        "type": "danger",
        "message": "Password must be more than 5 characters."
      };
      error = true;
    }
    if (error) {
      //Create alert and send back
      alert.alertResponse(sendData, function (errorData) {
        res.send(JSON.stringify(errorData));
      });
    } else {
      DB.Cus.count({ where: { 'email': email } }).then(isAvailable => { // Email is available or not
        if (isAvailable) {
          //EMAIL ADDRESS IS ALREADY AVAILABLE
          res.end('ER');
        } else {
          bcrypt.hash(password, 5, function (err, hash) {
            DB.sequelize.query("select get_nextid('cus') as id;").then(nextId => {
              let userAccount = new DB.Cus();
              userAccount.cusunkid = nextId[0][0].id;
              userAccount.email = email.toLowerCase();
              userAccount.password = hash;
              userAccount.username = name.toLowerCase();
              userAccount.contact = contact;
              //REGISTER USER ACCOUNT
              userAccount.save().then(() => {
                res.end('Registered');
              }).catch(ex => {
                logger.error("Error in saving new user's details: " + ex);
                res.end('err');
              });
            }).catch(ex => {
              logger.error("Error in getting new cus id: " + ex);
              res.end('err');
            });
          });
        }
      }).catch((ex) => {
        logger.error("Error in registering users: " + ex);
        res.end('err');
      });
    }
  } catch (ex) {
    logger.error("Something went wrong to register new user: " + ex);
    res.end('err');
  }
};


exports.login = function (req, res) {
  logger.info("Users page ::: Function: login");
  // Just to check all req information
  let email = req.body.email;
  let password = req.body.password;

  DB.Cus.findOne({
    where: { email: email }, attributes: ['password', 'cusunkid', 'username']
  }).then(user => {
    if (user) {
      bcrypt.compare(password, user.password).then(isValid => {
        logger.info("Whether password is valid or not: " + isValid);
        if (isValid) {
          user = { 'username': user.username, 'cusunkid': user.cusunkid };
          req.session.user = user;
          req.session.userAuthenticated = true;
          res.end(JSON.stringify(user));
        } else {
          res.end('fail');
        }
      }).catch(ex => {
        logger.error("Error in bcrypt compare with user login: " + ex);
        res.end('fail');
      });
    } else {
      res.end('fail');
    }
  });
};


exports.logout = function (req, res) {
  logger.info("Users page ::: Function: logout");
  req.session.userAuthenticated = false;
  req.session.user = null;
  res.json("Logged out");
}
