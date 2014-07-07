#!/usr/bin/env node

var http = require('http');
var path = require('path');

global['__APP_ROOT_PATH']		= __dirname;
global['__APP_MODELS_PATH']		= path.join(__dirname,'models');
global['__APP_VIEWS_PATH'] 		= path.join(__dirname,'views');
global['__APP_CONTROLLERS_PATH']	= path.join(__dirname,'controllers');
global['__APP_PUBLIC_PATH']      	= path.join(__dirname,'public');

var app  	= require('./app');
var server  	= http.createServer(app);

server.on('error', function(e){
	switch(e.code) {
		case 'EACCES':
			console.error("Fatal Error: Insufficient user privleges! Unable to access PORT: " + app.get('port'));
			process.exit();
			break;
		case 'EADDRINUSE':
			console.error("Fatal Error: Unable to bind to address: "+app.get('address') + ":" + app.get('port'));
			process.exit();
			break;
		case 'EADDRNOTAVAIL':
			console.error("Fatal Error: Unable to bind to address: " + app.get('address') + ":"+app.get('port'));
			process.exit();
		default:
			console.error('Error: ' + e.code );
	}
});

process.once('dbready', function() {
	app.emit('ready');
});

server.on('listening', function(){
	console.warn("http server listening at " + app.get('address') + ":" + app.get('port'));
});

app.on('ready', function() {
	app.ready = true;
	server.listen(app.get('port'), app.get('address'));
});