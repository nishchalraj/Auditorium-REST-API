var mongoose = require('mongoose'),
    errors = require('restify-errors'),
    User = require('../models/user'),
    ObjectId = mongoose.Types.ObjectId;
    

exports.allUser = function(req, res, next) {
    if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.apiQuery(req.params, function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User Data not found");
            }
        }
    });
};
exports.listUser = function(req, res, next) {
    if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.find({isAdmin :false},{pass: 0, isAdmin: 0, token: 0 }, function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User Data not found");
            }
        }
    });
};

exports.createUser = function(req, res, next) {
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    var userModel = new User(req.body);
    userModel.save(function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            res.json(user);
        }
    });
};
 
exports.viewUser = function(req, res, next) {
    if (!req.params.id) {
			return next(
				new errors.InvalidContentError("Expects 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.findById(new ObjectId(req.params.id), function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User: " + req.params.id + " not found");
            }
        }
    });
};

exports.updateUser = function(req, res, next) {
    if (!req.params.id) {
			return next(
				new errors.InvalidContentError("Expects 'id' parameter")
			);
	}
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    var updatedUserModel = new User(req.body);
    User.findByIdAndUpdate(new ObjectId(req.params.id), updatedUserModel, function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User: " + req.params.id + " not found");
            }
        }
    });
};
 
exports.deleteUser = function(req, res, next) {
    if (!req.params.id) {
			return next(
				new errors.InvalidContentError("Expects 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.findByIdAndRemove(new Object(req.params.id), function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            res.json("User: " + req.params.id + " deleted successfully");
        }
    });
};