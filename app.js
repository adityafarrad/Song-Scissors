/*
 * Module dependencies
 *
 */
var express = require('express');
var fs = require('fs');
var os = require('os');
var path = require('path');
var AppError = require('./lib/AppError.js');
var errorHandler = require('./lib/errorHandler.js');
var debug = require('debug')('SongScissors: ');
var config = require('./config.js');
var compress = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var multer = require('multer');
var autoReap = require('multer-autoreap');
var favIcon = require('static-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var expressLayouts = require('express-ejs-layouts');



/*
 * Initialize the app instance
 */
var app = module.exports = express();
app.ready = false;
app.disable('x-powered-by');

app.use(compress());
app.use(express.static(__APP_PUBLIC_PATH));
app.use(favIcon(__APP_PUBLIC_PATH + '/favIcon.ico'));

for (var name in config.server) {
	if (config.server.hasOwnProperty(name)) {
		app.set(name, config.server[name]);
	}
}

if ('messaging' in config) {
	app.set('messaging', config.messaging);
}

app.set('views', __APP_VIEWS_PATH);
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(morgan({format: config.logFormat}));

// parse application/json and application/x-www-form-urlencoded
app.use(bodyParser());

// parse multipart/form data params and files written to tmpp dir
app.use(multer({dest: os.tmpdir()}));

// cleanup uploaded files on response end
app.use(autoReap);

var expressSecret = '($$&LiHJoeiui!^&';
app.use(cookieParser(expressSecret));
app.use(session({
	key: 'SS_ID',
	secret: expressSecret,
	cookie: {
		maxAge: (((60 * 60) * 24) * 7) * 1000 // maxAge 7 days
	},
	store: new MongoStore(config.sessionStore, function() {
		app.emit('ready');
		debug('db is ready');
	})
}));

app.use(csurf());
app.use(function(req, res, next) {
	// NOTE: ensure the _csurf token is available in any forms, add the following to the form:
	// ....blah blah blah...
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.route('/ping').get(function(req, res) {
	req.session.ping = true;
	res.send('ping');
});

/*
 * Load routes
 *
 */
var routes = [];

try {
	var dirList = fs.readdirSync(__APP_CONTROLLERS_PATH);
	dirList.forEach(function(controller) {
		var dirStat = fs.statSync(path.join(__APP_CONTROLLERS_PATH, controller));
		if (dirStat.isDirectory()) {
			routes.push(
				require(path.join(__APP_CONTROLLERS_PATH, controller))(app, controller)
			);
		}
	}) 
} catch (err) {
	console.error('Read error: ' + err);
	process.exit();
}

app.use(function(req, res, next) {
	next(new AppError('Resource not found! ' + req.path, 404));
});

errorHandler.title = 'Song Scissors';
app.use(errorHandler);