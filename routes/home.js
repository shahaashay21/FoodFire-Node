/* GET home page. */
exports.index = function(req, res, next) {
  res.render('home', {'user': req.session.user, 'userAuthenticated': req.session.userAuthenticated, 'csrfToken': req.csrfToken()});
};
