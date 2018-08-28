import {resolve,reject} from '../lib/utils';
const BASEURL = process.env.FRIEND_SERVICE_BASEURL;

module.exports = function (Advertisement: any) {
    Advertisement.current = function(accountId:string,cb: Function){
        return Advertisement.get(BASEURL+'/Advertisements/current',{accountId:accountId},cb);
    }

    Advertisement.remoteMethod('current', {
        accepts: [
            {arg: 'accountId',type: 'string'}
        ],
        http: {path: '/current', verb: 'get'},
        returns: [
            { arg: 'data', type: ['Advertisement'],root:true}
        ]
    });

}