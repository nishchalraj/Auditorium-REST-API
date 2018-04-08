const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseStringQuery = require('mongoose-string-query');

const audiSchema = new Schema({
  audi: {                 
        type: String,
        required: true,
        unique: true
  },
},	{ minimize: false ,versionKey: false}
);

audiSchema.plugin(mongooseStringQuery);

const Audi = mongoose.model('Audi', audiSchema);
module.exports = Audi;
