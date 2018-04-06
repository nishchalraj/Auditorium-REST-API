module.exports = {
	name: 'AUDI-API',
	env: process.env.NODE_ENV || 'production',
	port: process.env.PORT || 80,
	base_url: 'http://0.0.0.0:80',
	db: {
		uri: 'mongodb://term:term@ds237409.mlab.com:37409/api1',
	}
};
