const BASEURL = process.env.TAOBAO_SERVICE_BASEURL;
import {resolve,reject} from "../lib/utils";

module.exports = function (System: any) {

    System.find = function(filter:object,cb: Function){
        return System.get(BASEURL+'/Systems',{filter:filter},cb);
    }

    System.remoteMethod('find', {
        description: 'Find all instances of the model matched by filter from the data source.',
        accessType: 'READ',
        accepts: [
          {arg: 'filter', type: 'object', description:
          'Filter defining fields, where, include, order, offset, and limit - must be a ' +
          'JSON-encoded string ({"something":"value"})'}
        ],
        returns: {arg: 'data', type: ['System'], root: true},
        http: {verb: 'get', path: '/'},
    });

    System.prototype.goods = function(sort:number,page_no:number,page_size:number,cb:Function){
        return System.get(
            BASEURL+'/Systems/'+this.id.toString()+'/goods',
            {sort:sort,page_no:page_no,page_size:page_size},
            cb
        );
    }

    System.remoteMethod('prototype.goods', {
        accepts: [
            {arg: 'sort',type: 'number',description:'优惠劵:0.综合（最新），1.券后价(低到高)，2.券后价（高到低），3.券面额（高到低），4.销量（高到低），5.佣金比例（高到低）;'
        +'淘抢购:11.折扣价(低到高),12.折扣价(高到低),13.开始时间（旧到新）,14.开始时间（新到旧）,'
        +'15.结束时间（旧到新）,16.结束时间（新到旧）,17.剩余（低到高）,18.折扣力度（高到低）,4.销量（高到低），5.佣金比例（高到低）'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        description:"find goods from one sources/systemid",
        http: {path: '/goods', verb: 'get'},
        returns: [
            { arg: 'items', type: ['Coupon'],root:true}
        ]
    });

    System.xgoods = function(systemIds:string,sort:number,page_no:number,page_size:number,cb:Function){
        return System.get(
            BASEURL+'/Systems/xgoods',
            {systemIds:systemIds,sort:sort,page_no:page_no,page_size:page_size},
            cb
        );
    }

    System.remoteMethod('xgoods', {
        accepts: [
            {arg: 'systemIds',type: 'string',description:'支持多systemId筛选，如03cb0af4ad3b46558459ceaa95566691,03cb0af4ad3b46558459ceaa95566692,逗号仅限英文逗号'},
            {arg: 'sort',type: 'number',description:'0.综合（最新），1.券后价(低到高)，2.券后价（高到低），3.券面额（高到低），4.销量（高到低），5.佣金比例（高到低）'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        description:"find goods aggregated from multiple sources/systemids",
        http: {path: '/xgoods', verb: 'get'},
        returns: [
            { arg: 'items', type: ['Coupon'],root:true}
        ]
    });

    System.findBySubcat = function(subcat:string,sort:number,page_no:number,page_size:number,cb:Function){
        return System.get(
            BASEURL+'/Systems/findBySubcat',
            {subcat:subcat,sort:sort,page_no:page_no,page_size:page_size},
            cb
        );
    }

    System.remoteMethod('findBySubcat', {
        accepts: [
            {arg: 'subcat',type: 'string',description:'level2 category'},
            {arg: 'sort',type: 'number',description:'0.综合（最新），1.券后价(低到高)，2.券后价（高到低），3.券面额（高到低），4.销量（高到低），5.佣金比例（高到低）'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        description:"find hot goods by subcat",
        http: {path: '/findBySubcat', verb: 'get'},
        returns: [
            { arg: 'items', type: ['Coupon'],root:true}
        ]
    });

}