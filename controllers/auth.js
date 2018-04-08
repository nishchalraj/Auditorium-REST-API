var jwt = require("jsonwebtoken"),
    errors = require('restify-errors'),
    User = require('../models/user'),
    fs = require("fs");

exports.authUser = function(req, res,next) {
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Requires 'Content-type: application/json'")
			);
	  }
	  if(!req.params.user && !req.params.pass) {
			return next(
				new errors.UnauthorizedError("Requires username and password")
			);
	  }
    User.findOne({user: req.params.user}, function(err, users) {
    if (err){
      return next(
				new errors.InternalServerError("We got stuck in an error")
			);
    }
    if (!users) {
      return next(
				new errors.ForbiddenError("Authentication failed. User not found.")
			);
    } else if (users) {
      if (users.pass != req.params.pass) {
       return next(
				new errors.ForbiddenError('Authentication failed. Wrong password.')
			);
      } else {
      var payload ={
        _id: users._id,
        user: users.user,
        isAdmin: users.isAdmin
      };
      var cert = fs.readFileSync('./keys/private.key');
      var token = jwt.sign(payload, cert, {
          algorithm: 'RS512',
          expiresIn : 60*60*24*14 // expires in 24*14 hours
        });
        User.findOneAndUpdate({user: users.user}, { $set: { token: token } }, { new: true }, function(err, useless) {
      if (err){
        return next(
				new errors.InternalServerError("Got stuck in an error") //500
			);
      }
    });
        if(users.isAdmin)
        res.status(201);
        res.json({ token :token });

      }

    }

  });
};
