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

const isEurekaEnabled = process.env.EUREKA_ENABLED=="true"?true:false;

function startEurekaClient(){
  const app_name = process.env.EUREKA_CLIENT_APPLICATION_NAME||require('../package.json').name;
  const ip_address = process.env.EUREKA_CLIENT_EXTERNAL_IP || '127.0.0.1';
  const host_name = process.env.EUREKA_CLIENT_EXTERNAL_HOSTNAME || 'localhost';
  const eureka_urls = process.env.EUREKA_SERVICE_URL ||"http://localhost:8700/eureka/apps";
  const app_port = process.env.EUREKA_CLIENT_EXTERNAL_PORT || app.get('port');
  const container_id = process.env.HOSTNAME || '408daec6d2c8';
  
  const Eureka = require('eureka-js-client').Eureka;
  const client = new Eureka({
    instance: { 
      instanceId: container_id +':'+app_name+':'+app_port,
      app: app_name,
      hostName: host_name,
      ipAddr: ip_address,
      healthCheckUrl: 'http://'+host_name+':'+app_port+'/health',
      secureHealthCheckUrl: 'https://'+host_name+':'+app_port+'/health',
      statusPageUrl: (isSSLEnabled? 'https://' : 'http://')+host_name+':'+app_port,
      port: {
        '$': app_port,
        '@enabled': isSSLEnabled?'false':'true',
      },
      securePort:{
        '$': app_port,
        '@enabled': isSSLEnabled?'true':'false',
      },
      nonSecurePortEnabled: !isSSLEnabled,
      securePortEnabled: isSSLEnabled,
      vipAddress: app_name,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      }
    },
    requestMiddleware: (requestOpts, done) => {
      requestOpts.agentOptions = {
        ca: fs.readFileSync(path.join(__dirname, './private/kujianet.pem'))
      };
      done(requestOpts);
    },
    eureka: {
      preferIpAddress:false,
      ssl:isSSLEnabled,
      serviceUrls: {
        default: eureka_urls.split(',')
      }
    },
    // eureka: {
    //   host: 'localhost',
    //   port: 8700,
    //   servicePath: '/eureka/apps/'
    // }
  });
  client.start(err=>console.log('eureka register:',err));
}


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

  if (isEurekaEnabled) startEurekaClient();
});
