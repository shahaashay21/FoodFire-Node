//LIBS
let validator = require('validator');
let bcrypt = require('bcryptjs');

//HELPERS
let response = require('../helper/response');
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
        "email": "Please check your email id."
      };
      error = true;
    } else if (common.isEmpty(name)) {
      sendData = {
        "name": "Name field should not be empty."
      };
      error = true;
    } else if (common.isEmpty(contact) || contact.length < 6 || isNaN(contact)) {
      sendData = {
        "mobile": "Mobile must be more than 5 characters and numeric."
      };
      error = true;
    } else if (common.isEmpty(password) || password.length < 6) {
      sendData = {
        "password": "Password must be more than 5 characters."
      };
      error = true;
    }
    if (error) {
      //Create alert and send back
      response.error({message: sendData}, returnData => {
        res.send(returnData);
      });
    } else {
      DB.Cus.count({ where: { 'email': email } }).then(isAvailable => { // Email is available or not
        if (isAvailable) {
          //EMAIL ADDRESS IS ALREADY AVAILABLE
          response.create({modal: 1, message: 'ER'}, returnData => {
            res.send(returnData);
          });
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
                response.create({message: 'Registered'}, returnData => {
                  res.send(returnData);
                });
              }).catch(ex => {
                logger.error("Error in saving new user's details: " + ex);
                response.error({message: 'err'}, returnData => {
                  res.send(returnData);
                });
              });
            }).catch(ex => {
              logger.error("Error in getting new cus id: " + ex);
              response.error({message: 'err'}, returnData => {
                res.send(returnData);
              });
            });
          });
        }
      }).catch((ex) => {
        logger.error("Error in registering users: " + ex);
        response.error({message: 'err'}, returnData => {
          res.send(returnData);
        });
      });
    }
  } catch (ex) {
    logger.error("Something went wrong to register new user: " + ex);
    response.error({message: 'err'}, returnData => {
      res.send(returnData);
    });
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
        if (isValid) {
          user = { 'username': user.username, 'cusunkid': user.cusunkid };
          req.session.user = user;
          req.session.userAuthenticated = true;
          // res.send(JSON.stringify(user));
          response.create({message: user}, returnData => {
            res.send(returnData);
          })
        } else {
          response.error({message: 'fail'}, returnData => {
            res.send(returnData);
          });
        }
      }).catch(ex => {
        logger.error("Error in bcrypt compare with user login: " + ex);
        response.error({message: 'fail'}, returnData => {
          res.send(returnData);
        });
      });
    } else {
      response.error({message: 'fail'}, returnData => {
        res.send(returnData);
      });
    }
  });
};


exports.logout = function (req, res) {
  logger.info("Users page ::: Function: logout");
  req.session.userAuthenticated = false;
  req.session.user = null;
  // res.json("Logged out");
  response.create({message: 'Logged out'}, returnData => {
    res.send(returnData);
  });
}
