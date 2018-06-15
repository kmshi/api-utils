'use strict';
require('ts-node/register');
require('dotenv').config();//use .env to set environment variables
if (process.env.NODE_ENV != 'development' && process.env.NODE_ENV != 'testing'){
  require('./lib/logging');//use bunyan and slack logging framework
}

var loopback     = require('loopback');
var boot         = require('loopback-boot');
var cookieParser = require('cookie-parser');

var https = require('https');
var http = require('http');
var sslConfig = require('./ssl-config');

var app = module.exports = loopback();
const isSSLEnabled = process.env.HTTPS_ENABLED=="true"?true:false;

app.use(cookieParser());

app.start = function() {
  // start the web server
  var server = null;
  if(isSSLEnabled) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(app.get('port'),function() {
    app.emit('started', server);
    var baseUrl = (isSSLEnabled? 'https://' : 'http://') + app.get('host') + ':' + app.get('port');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
