/*
 *  Application Configuration Settings
 *
 */

var config = {
    server: {
		address:	(process.env.OPENSHIFT_NODEJS_IP) ? process.env.OPENSHIFT_NODEJS_IP : '127.0.0.1',
		port:		(parseInt(process.env.OPENSHIFT_NODEJS_PORT)) ? parseInt(process.env.OPENSHIFT_NODEJS_PORT) : 3001,
	},
	mongodb: {
		host:		(process.env.OPENSHIFT_MONGODB_DB_HOST) ? process.env.OPENSHIFT_MONGODB_DB_HOST : '127.0.0.1',
		port:		(parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT)) ? parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) : 27017,
		dbname:		(process.env.OPENSHIFT_APP_NAME) ? process.env.OPENSHIFT_APP_NAME : 'SongScissors',
		username:  	(process.env.OPENSHIFT_MONGODB_DB_USERNAME) ? process.env.OPENSHIFT_MONGODB_DB_USERNAME : null,
		password:	(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) ? process.env.OPENSHIFT_MONGODB_DB_PASSWORD : null
	},
	messaging: {
		acnt_id: 	'123456',
		api_key:	'xxx',
		subject:	'an E-Mail',
		to_addr:	'joe-user@example.com',
		to_name:	'Joe User.',
		from_addr:	'messaging@example.com',
		from_sfx:	' via example.com'
	},
	sessionStore: {
	    db: 'ss',
	    auto_reconnect: true,
	    username:  	(process.env.OPENSHIFT_MONGODB_DB_USERNAME) ? process.env.OPENSHIFT_MONGODB_DB_USERNAME : null,
	    password:	(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) ? process.env.OPENSHIFT_MONGODB_DB_PASSWORD : null
	}
};

module.exports = config;