import {resolve,reject} from '../lib/utils';
const BASEURL = process.env.FRIEND_SERVICE_BASEURL;

module.exports = function (Life: any) {
    Life.current = function(accountId:string,page_no:number,page_size:number, cb: Function){
        let params = {
            accountId:accountId,
            page_no:page_no,
            page_size:page_size
        };
        return Life.get(BASEURL+'/Lifes/current',params,cb);
    }

    Life.remoteMethod('current', {
        accepts: [
            {arg: 'accountId',type: 'string'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        http: {path: '/current', verb: 'get'},
        returns: [
            { arg: 'data', type: ['Life'],root:true}
        ]
    });

    Life.prototype.increment = function(accountId:string, cb: Function){
        return Life.get(BASEURL+'/Lifes/'+this.id.toString()+'/increment',{accountId:accountId},cb);
    }

    Life.remoteMethod('prototype.increment', {
        accepts: [
            {arg: 'accountId',type: 'string'},
        ],
        http: {path: '/increment', verb: 'get'},
        returns: [
            { arg: 'data', type: 'Life',root:true}
        ]
    });    
}