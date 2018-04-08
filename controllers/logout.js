var errors = require('restify-errors'),
    User = require('../models/user');
    
exports.logout = function(req, res, next) {
  // find the user and kill the token
User.findOneAndUpdate({user: req.username}, { $set: { token: "GAMEOVER" } }, { new: true }, function(err, useless) {
      if (err){
        return next(
				new errors.InternalServerError("Got stuck in an error") //500
			); 
      }
      else 
        res.json({message: "GAMEOVER"});
    });
};