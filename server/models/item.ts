import {resolve,reject} from '../lib/utils';
const BASEURL = process.env.FRIEND_SERVICE_BASEURL;

module.exports = function (Item: any) {
    Item.current = function(accountId:string,page_no:number,page_size:number,cb: Function){
        let params = {
            accountId:accountId,
            page_no:page_no,
            page_size:page_size
        };
        return Item.get(BASEURL+'/Items/current',params,cb);
    }

    Item.remoteMethod('current', {
        accepts: [
            {arg: 'accountId',type: 'string'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        http: {path: '/current', verb: 'get'},
        returns: [
            { arg: 'data', type: ['Item'],root:true}
        ]
    });

    Item.increment = function(id:any,accountId:string, cb: Function){
        return Item.get(BASEURL+'/Items/'+id+'/increment',{accountId:accountId},cb);
    }

    Item.remoteMethod('increment', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,
            http: {source: 'path'}},
            {arg: 'accountId',type: 'string'},
        ],
        http: {path: '/:id/increment', verb: 'get'},
        returns: [
            { arg: 'data', type: 'Item',root:true}
        ]
    });

}