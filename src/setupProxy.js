const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	const CLOUDHAWK_URL = 'https://cloudhawk-api.funstufftech.com';

	app.use(
		'/applications',
		createProxyMiddleware({
			target: CLOUDHAWK_URL,
			changeOrigin: true,
			securet: false
		})
	);

	app.use(
		'/applications/*',
		createProxyMiddleware({
			target: CLOUDHAWK_URL,
			changeOrigin: true,
			securet: false
		})
	);

	app.use(
		'/versions',
		createProxyMiddleware({
			target: CLOUDHAWK_URL,
			changeOrigin: true,
			securet: false
		})
	);
};
