var errors = require('restify-errors'),
    User = require('../models/user');
    
exports.logout = function(req, res, next) {
  // find the user and kill token
User.findOneAndUpdate({user: req.username}, { $set: { token: Math.random()*10089 } }, { new: true }, function(err, useless) {
      if (err){
        return next(
				new errors.InternalServerError("Got stuck in an error") //500
			); 
      }
      else 
        res.json({message: "GAMEOVER"});
    });
};