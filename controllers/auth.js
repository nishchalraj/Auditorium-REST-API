var jwt = require("jsonwebtoken"),
    errors = require('restify-errors'),
    User = require('../models/user'),
    fs = require("fs");
    
exports.authUser = function(req, res,next) {
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
	  }
	  if(!req.params.user && !req.params.pass) {
			return next(
				new errors.UnauthorizedError("Expects username and password")
			);
	  }
  // find the user
    User.findOne({user: req.params.user}, function(err, users) {

    if (err) throw err;

    if (!users) {
      return next(
				new errors.ForbiddenError("Authentication failed. User not found.")
			);
    } else if (users) {

      // check if password matches
      if (users.pass != req.params.pass) {
       return next(
				new errors.ForbiddenError('Authentication failed. Wrong password.')
			); 
      } else {

        // if user is found and password is right
        // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
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
        // return the information including token as JSON
        res.json({token :token});
        
      }   

    }

  });
};