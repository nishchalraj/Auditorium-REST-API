var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 mongooseStringQuery = require('mongoose-string-query');
//var timestamps = require('mongoose-timestamp');

var userSchema = new Schema({
  name: { type: String, required: true }, 
  user: { type: String, required: true, trim: true , unique: true }, 
  pass: { type: String, required: true },
  token: { type: String , required: true , unique: true},
  isAdmin: { type: Boolean, required: true },
   
},
        { minimize: false ,versionKey: false}
);

//userSchema.plugin(timestamps);
userSchema.plugin(mongooseStringQuery);

var User = mongoose.model('User', userSchema);
module.exports = User;