var mongoose = require('mongoose'),
    errors = require('restify-errors'),
    User = require('../models/user'),
    ObjectId = mongoose.Types.ObjectId;
    
exports.pass = function(req, res , next) {
  if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
	  }
	 if(!req.params.currpass && ( req.params.newpass1 != req.params.newpass2 )) {
			return next(
				new errors.InvalidCredentialsError("Check your request")
			);
	  }
  User.findOne(new ObjectId(req.userId), function(err, user) {
    if (err){
        return next(
				new errors.InternalServerError("Failed to authenticate token.") //500
			); 
    }
    if (user.pass != req.params.currpass) {
      return next(
				new errors.InvalidCredentialsError("You entered wrong password!") //401
			);
    }
      User.findOneAndUpdate({user: user.user}, { $set: { pass: req.params.newpass1 } }, { new: true }, function(err, users) {
      if (err){
        return next(
				new errors.InternalServerError("Got stuck in an error") //500
			); 
      }
      else{ 
        if(users.isAdmin)
        res.status(201);
        res.json(users);
      }
    });

  });
};