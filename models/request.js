const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseStringQuery = require('mongoose-string-query');

const requestSchema = new Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  audi_id: { type: String, required: true },
  audi_name: { type: String },
  reason: { type: String, required: true },
  created_by: { type: String },
  approved: { type: Boolean , default : 0 },
  date: { type: String , required: true},
  stime: { type: String , required: true},
  etime: { type: String , required: true}
},
        { minimize: false ,versionKey: false}
);

requestSchema.plugin(mongooseStringQuery);

var Request = mongoose.model('Request', requestSchema);
module.exports = Request;
