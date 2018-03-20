let mongoose = require('mongoose');
var User = require('../model/UserModel');
let helper = require('../common/HelperFunction');
var restify = require("restify");
var jwt    = require('jsonwebtoken'); 
var jwtsecret = require('../common/jwtsecret'); 
var Router = require('restify-router').Router;
var routerInstance = new  Router();
var restify = require('restify');
var aes256 = require('aes256');
var seed = 'This is a top secret key seed for aec256. Please do not remove this key.';

//No support for aec256 encryption to dycript the password because this will return all the users,
//so not good to expose all user passwords. Just for test
function getuser(req, res, next) {
	var query = User.find({});
	query.exec((err, users) => {
		if (err) {
			helper.failure(res, next, 'Problem with the request', 400);
			return next();
		}
		else {
			helper.success(res, next, users);
			return next();
		}
	});
}

//supporting aec256 encryption in POST function in authenticate to dycript the password and display it to the user.
function getforgotPassword(req, res, next) {
	var email = req.params.email_address;
	var cipher = aes256.createCipher(seed);
	User.findOne({ email_address: email }, function (err, user) {
		if (err) {
			helper.failure(res, next, 'Something went wrong while fetching the user from the database', 500);
			return next();
		}
		if (user === null) {
			helper.failure(res, next, 'The specified user could not be found', 404);
			return next();
		}
		var decryptedPwd = cipher.decrypt(user.password);
		helper.success(res, next, decryptedPwd);
		return next();
	});
}
//supporting aec256 encryption in POST function. It will encrypt the password before saving the pwd in the DB.
function postuser(req, res, next) {
	var newUserModel = new User(req.body);	
	var pwd = req.body.password;
	var cipher = aes256.createCipher(seed);
	var encrypted = cipher.encrypt(req.body.password);
	newUserModel.password = encrypted;
	newUserModel.save((err, node) => {
		if (err) {
					helper.failure(res, next, 'Error while fetching data from the database', 500);
					return next();
				 }
					helper.success(res, next, newUserModel);
					return next();
				});
	
}

//supporting aec256 encryption in POST function in authenticate to dycript the password and display it to the user.
function authenticate(req, res, next) {
    var cipher = aes256.createCipher(seed);
    var dycryptedPwd="";
// find the user
	User.findOne({
		email_address: req.body.email_address
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			//res.json({ success: false, message: 'Authentication failed. User not found.' });
			helper.failure(res, next, 'Authentication failed. User not found.', 401);
		    return next();
		} else if (user) {

			// check if password matches
			dycryptedPwd = cipher.decrypt(user.password);
			    console.log('Original Password =' + req.body.password);
				console.log('encrypted password =' + dycryptedPwd);
				console.log('user.password =' + user.password);
			if (req.body.password != dycryptedPwd) {
				helper.failure(res, next, 'Authentication failed.  Wrong password.', 401);
			} else {

				// if user is found and password is right
				// create a token
				var payload = {id: user.id};
                var token = jwt.sign(payload, 'jwtsecret');
                user.password = dycryptedPwd;
                var result = user + token
                helper.success(res, next, result);
			    return next();
			}		

		}

	});
}

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
routerInstance.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

//add a restify router
// add a route like you would on a restify server instance
routerInstance.get('/authenticate/', authenticate);
routerInstance.get('/getuser/', getuser);

//export all the functions
module.exports = { getuser, postuser, getforgotPassword, authenticate };

