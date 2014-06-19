var express = require('express');
var debug = require('debug')('SongScissors: ');
var app = express();

app.route('/').get(function(req, res, next){
	
	res.send('hello');
	debug('said hello, method %s, path %s', req.method, req.path);
});

