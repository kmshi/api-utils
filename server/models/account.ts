const BASEURL = process.env.ACCOUNT_SERVICE_BASEURL;

module.exports = function(Account:any) {
    Account.count = function(where:object,cb: Function){
        return Account.get(BASEURL+'/agendaJobs/count',{where:where},cb);
    }

    Account.remoteMethod('count', {
        description: 'Count instances of the model matched by where from the data source.',
        accessType: 'READ',
        accepts: [
          {arg: 'where', type: 'object', description: 'Criteria to match model instances'},
        ],
        returns: {arg: 'info', type: 'object',root:true},
        http: {verb: 'get', path: '/count'},
    });
}