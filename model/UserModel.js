var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var UserSchema = new Schema({
    id             : ObjectId,
    first_name     : String,
    last_name      : String,
    password	   : String,
    email_address  : String,
    empId          : String,
    department     : String,
    previllege     : String
});


var UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;