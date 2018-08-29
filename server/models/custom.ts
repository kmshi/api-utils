const BASEURL = process.env.TAOBAO_SERVICE_BASEURL;
import {resolve,reject} from "../lib/utils";

module.exports = function (Custom: any) {

    Custom.find = function(filter:object,cb: Function){
        return Custom.get(BASEURL+'/Customs',{filter:filter},cb);
    }

    Custom.remoteMethod('find', {
        description: 'Find all instances of the model matched by filter from the data source.',
        accessType: 'READ',
        accepts: [
          {arg: 'filter', type: 'object', description:
          'Filter defining fields, where, include, order, offset, and limit - must be a ' +
          'JSON-encoded string ({"something":"value"})'}
        ],
        returns: {arg: 'data', type: ['Custom'], root: true},
        http: {verb: 'get', path: '/'},
    });

    Custom.goods = function(id:any,page_no:number,page_size:number,cb:Function){
        return Custom.get(BASEURL+'/Customs/'+id+'/goods',{page_no:page_no,page_size:page_size},cb);
    }

    Custom.remoteMethod('goods', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,
            http: {source: 'path'}},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        http: {path: '/:id/goods', verb: 'get'},
        returns: [
            { arg: 'items', type: ['Coupon'],root:true}
        ]
    });

}