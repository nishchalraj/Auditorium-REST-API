var mongoose = require('mongoose'),
    moment = require('moment-timezone'),
    errors = require('restify-errors'),
    Request = require('../models/request'),
    Audi = require('../models/audi'),
    ObjectId = mongoose.Types.ObjectId;

exports.pendingRequest = function(req, res, next) {
    if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    //Request.find({}, function(err, request) {
    Request.find({approved : false}, function(err, request) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            if (request) {
                res.json(request);
            } else {
                res.json({Message: "Request Data not found"});
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
                res.json({Message: "Request Data not found"});
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
	Audi.findOne(new ObjectId(req.body.audi_id), function(err, audi) {
        if (err){
        return next(
				new errors.InternalServerError("Audi ID not found") //500
			); 
        } else {
            if (audi) {
                req.body.audi_name = audi.audi;
                //dark magic begins
                var date = req.body.date +" "+req.body.etime;
                date = moment(date); 
                //date = date.tz('Asia/Calcutta').format("YYYY-MM-DDTHH:MM:ss");
                date = date.tz('America/New_York').format("YYYY-MM-DDTHH:MM:ss");
                req.body.expireAt = new Date(date);
	            if(req.Admin)
	            req.body.approved = 1;
	            req.body.created_by = req.username;
                var requestModel = new Request(req.body);
                console.log(Date.now());
                requestModel.save(function(err, request) {
                if (err){
                return next(
				    new errors.InternalServerError("We stuck in an error") //500
			    ); 
                } else {
                    res.json(request);
                }
                });
            } else {
                res.json({message: "No audi name found"});
            }
        }
    });
    
};
 
exports.viewRequest = function(req, res, next) {
    if (req.params.id.length != 24) {
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
                res.json({message: "Request not found"});
            }
        }
    });
};

exports.approveRequest = function(req, res, next) {
    if (req.params.id.length != 24) {
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
    if (req.params.id.length != 24) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    Request.findByIdAndRemove(new Object(req.params.id), function(err, useless) {
        if (err){
        return next(
				new errors.InternalServerError("Request ID not found") //500
			); 
      } else {
            res.json({message: "Request deleted successfully"});
        }
    });
};
