var mongoose = require('mongoose'),
 errors = require('restify-errors'),
 Audi = require('../models/audi'),
 Request = require('../models/request'),
 ObjectId = mongoose.Types.ObjectId;
 
exports.listAudi = function(req, res, next) {  
    console.log(req)
    Audi.apiQuery(req.params,function(err, audi) {
//    Audi.findOne({},function(err, audi) {
        if (err){
        return next(
				new errors.InternalServerError("Error occured: " + err) //500
			); 
        } else {
            if (audi) {
                //res.send({data :audi});
                res.json(audi);
            } else {
                res.json("Audi Data not found");
            }
        }
    });
};

exports.createAudi = function(req, res, next) {
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
    var audiModel = new Audi(req.body);
    audiModel.save(function(err, audi) {
        if (err){  
        return next(
				new errors.InternalServerError("Error occured: " + err) //500
			); 
        } else {
            res.json(audi);
        }
    });
};

exports.viewApproveRequest = function(req, res, next) {
    if (!req.params.id) {
			return next(
				new errors.InvalidContentError("Expects 'id' parameter")
			);
	}
    Request.find({ audi_id : req.params.id , approved : 1 } , function(err, audi) {
        if (err){
        return next(
				new errors.InternalServerError("AUDI ID not found") //500
			); 
      } else {
            if (audi) {
                res.json(audi);
            } else {
                res.json("Audi Data not found");
            }
        }
    });
};
 
exports.viewAudi = function(req, res, next) {
    if (!req.params.id) {
			return next(
				new errors.InvalidContentError("Expects 'id' parameter")
			);
	}
    Audi.findById(new ObjectId(req.params.id), function(err, audi) {
        if (err){
        return next(
				new errors.InternalServerError("Error occured: " + err) //500
			); 
        } else {
            if (audi) {
                res.json(audi);
            } else {
                res.json("Audi: " + req.params.id + " not found");
            }
        }
    });
};

exports.updateAudi = function(req, res, next) {
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
    var updatedAudiModel = new Audi(req.body);
    Audi.findByIdAndUpdate(new ObjectId(req.params.id), updatedAudiModel, function(err, audi) {
        if (err){
        return next(
				new errors.InternalServerError("Error occured: " + err) //500
			); 
        } else {
            if (audi) {
                res.json(audi);
            } else {
                res.json("Audi: " + req.params.id + " not found");
            }
        }
    });
};
 
exports.deleteAudi = function(req, res, next) {
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
    Audi.findByIdAndRemove(new Object(req.params.id), function(err, audi) {
        if (err){
        return next(
				new errors.InternalServerError("Error occured: " + err) //500
			); 
        }
         else {
            res.json("Audi: " + req.params.id + " deleted successfully");
        }
    });
};