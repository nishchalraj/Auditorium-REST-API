var mongoose = require('mongoose'),
    errors = require('restify-errors'),
    Request = require('../models/request'),
    ObjectId = mongoose.Types.ObjectId;

exports.allRequest = function(req, res, next) {
    if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    Request.find({}, function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            if (request) {
                res.json(request);
            } else {
                res.json("Request Data not found");
            }
        }
    });
};

exports.listRequest = function(req, res, next) {
    Request.find({approved : true}, function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            if (request) {
                res.json(request);
            } else {
                res.json("Request Data not found");
            }
        }
    });
};
 
exports.createRequest = function(req, res, next) {
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Requires 'Content-type: application/json'")
			);
	}
	if (req.params.approved && !req.Admin) {
			return next(
				new errors.InvalidContentError("You are not admin")
			);
	}
    var requestModel = new Request(req.body);
    requestModel.save(function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            res.json(request);
        }
    });
};
 
exports.viewRequest = function(req, res, next) {
    if (req.params.id.length != 12) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
    Request.findById(new ObjectId(req.params.id), function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            if (request) {
                res.json(request);
            } else {
                res.json("Request: " + req.params.id + " not found");
            }
        }
    });
};

exports.approveRequest = function(req, res, next) {
    if (req.params.id.length != 12) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    Request.findOneAndUpdate(new ObjectId(req.params.id), { $set: { approved: 1 } }, { new: true }, function(err, request) {
      if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      }
      else 
        res.json(request);
    });
};
 
exports.deleteRequest = function(req, res, next) {
    if (req.params.id.length != 12) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    Request.findByIdAndRemove(new Object(req.params.id), function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            res.json("Request: " + req.params.id + " deleted successfully");
        }
    });
};

exports.delOldRequests  = function(req, res, next) {
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    Request.deleteMany({ approved : 1 , date: { $it: Date.now } }, function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("We got errors") //500
			); 
      } else {
            res.json({message: "Old Requests deleted successfully"});
        }
    });
};