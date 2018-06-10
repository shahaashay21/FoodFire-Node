var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SequelizeAuto = require('sequelize-auto');
var helmet = require("helmet");
var csrf = require('csurf')
//SQL Session
var MySQLStore = require('express-mysql-session')(session);
//CSRF token
var csrfProtection = csrf({ cookie: true });

//Use environment variables
require('dotenv').config();

//Create automatically database model
var auto = new SequelizeAuto(process.env.database_name, process.env.database_user, process.env.database_password, {
    host: process.env.host,
    dialect: 'mysql',
    directory: path.join(__dirname, 'models'), // prevents the program from writing to disk
    port: 3306,
    additional: {
        timestamps: false
    }
});

// Run every time when change in DB
// auto.run(function (err) {
//     if(err){
//         console.log(err);
//     }
// });

//Fetch all routes files
var home = require('./routes/home');
var users = require('./routes/users');
var search = require('./routes/search');
var restaurant = require('./routes/restaurant');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');
var address = require('./routes/address');

//Middleware files
Mlog = require('./middleware/Mlog');
winston = require('./middleware/winston');

var app = express();
app.use(helmet());

//MySQL connection
var options = {
    host: process.env.host,
    port: 3306,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database_name,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};


var sessionStore = new MySQLStore(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static('node_modules'));

app.use(session({
    key: 'FoodFire',
    secret: 'FoodFire',
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: sessionStore
}));

app.use(Mlog.genericInfo);
app.use(winston.genericInfo);
app.use(csrfProtection);




// app.use('/users', users);

/////////////////////////////////////////
//////		INITIALIZATION		   //////
/////////////////////////////////////////
// NOTHING FOR NOW


/*-----------
		FoodFire
-----------*/
// HOME PAGE OF FOODFIRE
app.get('/', home.index);

//SEARCH PAGE REQUEST
app.get('/search', search.index);

//RESTAURANT PAGE
app.get('/vendor/:city/:vendor_url', restaurant.index);

//CHECKOOUT PAGE
app.get('/checkout', checkout.index);




/*-----------
		TESTING
-----------*/
app.get('/logcart', cart.logSession);






/*-----------
		APIs
-----------*/
//USER REGISTER
app.post('/reg', users.register);

//USER LOGIN
app.post('/login', users.login);

//USER LOGOUT
app.post('/logout', users.logout);

// GET RECENT ACTIVITY
app.post('/getRecentActivity', search.getRecentActivity);

//Get reastaurant
app.post('/restaurants', search.restaurants);

//Get reastaurant's all products
app.post('/restaurantsProducts', restaurant.restaurantsProducts);

//Get item details
app.post('/getItem', restaurant.getItem);

//Add item into a cart
app.post('/cart/add', cart.addCart);

//Delete item from a cart
app.post('/cart/delete', cart.deleteCartItem);

//Update item from a cart
app.post('/cart/update', cart.updateCartItem);

//Get cart
app.post('/cart/get', cart.getCart);

//Get cities
app.post('/getcities', address.getcities);

//Get areas
app.post('/getareas', address.getareas);

//Add address
app.post('/address/add', address.addAddress);

//Get address
app.post('/address/get', address.getAddress);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
