var bunyan  = require("bunyan");
var BunyanSlack = require('bunyan-slack');

export var log = bunyan.createLogger({
    name: "cloud",
    streams: [{
        type: 'rotating-file',
        path: './cloud.log',
        period: '1d',   // daily rotation
        count: 30        // keep 30 back copies
    },{
      stream: process.stdout
    }],
    level: "trace"
});

log.addStream({
  name: "slack",
  stream: new BunyanSlack({
        webhook_url: "https://hooks.slack.com/services/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",
        channel: "#kujianet",
        username: "account-service",
        customFormatter: function(record:any, levelName:string){
            return {text: "[" + record.hostname + ' ' + record.time + "] " + JSON.stringify(record) }
        }
  }),
  level: "fatal"
});

//override console
console.trace = log.trace.bind(log);
console.log = log.debug.bind(log);
console.info = log.info.bind(log);
console.warn = log.warn.bind(log);
console.error = log.error.bind(log);
console.dir = log.fatal.bind(log);//send to slack
