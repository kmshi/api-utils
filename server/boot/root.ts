import { BootScript } from '@mean-expert/boot-script';
var Agenda:any = require('agenda');
var Agendash:any = require('agendash');


@BootScript()
class Root {
    constructor(app: any) {
        app.agenda = new Agenda({processEvery: '1 minute'});        

        var router = app.loopback.Router();
        router.get('/status', app.loopback.status());
        router.use('/agendash', Agendash(app.agenda));

        app.use(router);

        //start agenda...
        var settings = app.models.agendaJobs.dataSource.connector.settings;
        if (settings.connector == 'mongodb'){
            app.agenda.database(settings.url);
        }else{
            console.error("Agenda needs mongodb datasource to run!");
        }

        // app.agenda.define('expireAndRefund', (job: any, done: Function) => {
        //     console.log('run job',job.attrs);
        //     app.models.Game.findById(job.attrs.data.gameId, function (err: any, game: any) {
        //         if (err || !game) return done();
        //         game.expireAndRefund(done);
        //     });
        // });

        app.agenda.on('ready', function () {
            app.agenda.start();

            var baseUrl = (app.get('httpMode')? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
            console.log("Agenda started,check agenda jobs at %s/agendash/", baseUrl);
        });

        function graceful() {
            app.agenda.stop(function () {
                process.exit(0);
            });
        }
        
        process.on('SIGTERM', graceful);
        process.on('SIGINT', graceful);
    }
}

module.exports = Root;
