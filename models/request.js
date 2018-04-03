const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseStringQuery = require('mongoose-string-query');

const requestSchema = new Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  audi_id: { type: Number, required: true , trim: true},
  reason: { type: String, required: true },
  created_by: { type: String, required: true , trim: true},
  approved: { type: Boolean, required: true },
  date: { type: Date, default: Date.now ,required: true},
  stime: { type: Number, default: (new Date()).getTime() , required: true},
  etime: { type: Number, default: (new Date()).getTime() , required: true}
},
        { minimize: false ,versionKey: false}
);

requestSchema.plugin(mongooseStringQuery);

var Request = mongoose.model('Request', requestSchema);
module.exports = Request;
