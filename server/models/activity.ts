import {resolve,reject} from '../lib/utils';
const BASEURL = process.env.FRIEND_SERVICE_BASEURL;

module.exports = function (Activity: any) {
    Activity.current = function(accountId:string,cb: Function){
        return Activity.get(BASEURL+'/Activities/current',{accountId:accountId},cb);
    }

    Activity.remoteMethod('current', {
        accepts: [
            {arg: 'accountId',type: 'string'}
        ],
        http: {path: '/current', verb: 'get'},
        returns: [
            { arg: 'data', type: ['Activity'],root:true}
        ]
    });

}