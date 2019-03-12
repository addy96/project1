var mongoose = require('mongoose');

var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/* The user schema attributes / characterstrics / fields */
var UserSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	password:String,

	facebook: String,
	tokens: Array,
	
	profile:{
		name:{type:String, default: ''},
		picture:{type:String, default: ''}
	},

	address:String,
	history:[{
		date:Date,
		paid:{type:Number, default: 0}
		//item: {type:Schema.types.ObjectId, ref: ''}
	}]
})

/* Hash the password before we even save it to the database*/
 UserSchema.pre('save', function(next){
 var user = this;
 if(!user.isModified('password')) return next;
 bcrypt.genSalt(10, function(err, salt){
 	if(err) return next(err);
 	//user.password=123;
 	bcrypt.hash(user.password, salt, null, function(err, hash){
 		if(err) return next(err);
 		// hash = 123ab cdvjndfsk;
 		user.password = hash;
 		next();
 	});
  });
});


/* Compare password in the database and the one that the user type in*/
UserSchema.method.ComparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}
UserSchema.method.gravatar = function(size){
	if(!this.size) size = 200;
	if(!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}
module.exports = mongoose.model('User', UserSchema);