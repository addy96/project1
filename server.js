var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan  = require('morgan');
var ejs = require('ejs');
var engine = require('ejs-mate');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');

var app = express();

mongoose.connect(secret.database, function(err){
	if(err) {
		console.log(err);
	}else{
		console.log("Connect to the database");
	}
})

//Middlewear
app.use(express.static('__dirname' + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({url: secret.database, autoReconnect: true})
	
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

app.use(function(req, res, next){
	Category.find({}, function(err, categories){
		if(err) return next(err);
		res.locals.categories = categories;
		next();
	});
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');


var mainRouter = require('./routes/main');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin')
var apiRouter = require('./api/api');
app.use(mainRouter);
app.use(userRouter);
app.use(adminRouter);
app.use('/api', apiRouter);

app.listen(secret.port, function(err) {
	if(err) throw err;
	console.log("Server is running on port" + secret.port);
	// body...
});