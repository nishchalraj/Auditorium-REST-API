var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 mongooseStringQuery = require('mongoose-string-query');

var userSchema = new Schema({
  name: { type: String, required: true }, 
  user: { type: String, required: true, trim: true , unique: true }, 
  pass: { type: String, required: true },
  token: { type: String , unique: true , default: "GIVEITATRY" },
  isAdmin: { type: Boolean, default: 0 },
   
},
        { minimize: false ,versionKey: false}
);

userSchema.plugin(mongooseStringQuery);

var User = mongoose.model('User', userSchema);
module.exports = User;