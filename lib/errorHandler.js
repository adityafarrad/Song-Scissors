/*
 * express - errorHandler middleware
 */

var formatJson = require('stringify-object');


/**
 * Module dependencies.
 */

/**
 * Error handler:
 *
 * Development error handler, providing stack traces
 * and error message responses for requests accepting text, html,
 * or json.
 *
 * Text:
 *
 *   By default, and when _text/plain_ is accepted a simple stack trace
 *   or error message will be returned.
 *
 * JSON:
 *
 *   When _application/json_ is accepted, will respond with
 *   an object in the form of `{ "error": error }`.
 *
 * HTML:
 *
 *   When accepted will output a nice html stack trace.
 *
 * @return {Function}
 * @api public
 */

exports = module.exports = function errorHandler(err, req, res, next){
	var error;

	if (typeof err === 'string') {
		err = {
			status: 500,
			message: err,
			stack: ''
		};
	}
    if (err.status) {
		res.statusCode = err.status;
    }

	// default to 500 if we get here and status is not a code in the HTTP error classes
    if (res.statusCode < 400) {
		res.statusCode = 500;
    }


	if (!~['development','staging','testing','test'].indexOf(process.env['NODE_ENV'])) {
		err.stack = '';
	}

	// req.accepts defaults to the forst in the list if none match.
	switch(req.accepts(['text', 'html', 'json', 'javascript'])) {
		case'html':
			// html || xhtml
			error = {
				title: escapeHTML(exports.title),
				status: escapeHTML(err.status),
				message: escapeHTML(err.message),
				stack: escapeHTML(err.stack)
			};
			res.set('Content-Type', 'text/html; charset=utf-8');
			res.render('error', error);
			break;

		case 'json':
		case 'javascript':
			// json || javascript
			error = {
				title: exports.title,
				status: err.status,
				message: err.message,
				stack: err.stack
			};
			res.set('Content-Type', 'application/json');
			res.send(formatJson({ error: error }, {indent: '    ', singleQuotes: false}));
			break;

		case 'text':
			// default || plain text
			res.set('Content-Type', 'text/plain');
			res.send(exports.title + "\nError: " + err.status + "\n" + err.message + "\n" + err.stack);
			break;
	}
};

exports.title = 'purlHub';

function escapeHTML(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
	.replace(/\n/g, '<br/>');
};
