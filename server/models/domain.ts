import {resolve,reject} from '../lib/utils';
const BASEURL = process.env.FRIEND_SERVICE_BASEURL;

module.exports = function (Domain: any) {
    Domain.random = function(cb:Function){
        return Domain.get(BASEURL+'/Domains/random',null,cb);
    }

    Domain.remoteMethod('random', {
        accepts: [
        ],
        http: {path: '/random', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });
}