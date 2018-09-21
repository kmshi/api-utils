const BASEURL = process.env.TAOBAO_SERVICE_BASEURL;
import {resolve,reject} from "../lib/utils";

module.exports = function (Coupon: any) {

    Coupon.search = function(queryOrNum_iid:string,has_coupon:boolean,page_no:number,page_size:number,cb:Function){
        let params = {
            queryOrNum_iid:queryOrNum_iid,
            has_coupon:has_coupon,
            page_no:page_no,
            page_size:page_size
        };
        return Coupon.get(BASEURL+'/Coupons/search',params,cb);
    }

    Coupon.remoteMethod('search', {
        accepts: [
            {arg: 'queryOrNum_iid',type: 'string',required: true,description:'num_iid or query/keyword'},
            {arg: 'has_coupon',type: 'boolean',description:'是否有优惠券，设置为true表示该商品有优惠券，设置为false或不设置表示不判断这个属性'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        http: {path: '/search', verb: 'get'},
        returns: [
            { arg: 'data', type: ['Coupon'],root:true}
        ]
    });

    Coupon.queryTpwd = function(password_content:string,cb:Function){
        return Coupon.get(BASEURL+'/Alimamas/queryTpwd',{password_content:password_content},cb);
    }

    Coupon.remoteMethod('queryTpwd', {
        accepts: [
            {arg: 'password_content', type: 'string',required: true}
        ],
        http: {path: '/queryTpwd', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Coupon.hotkeywords = function(cb:Function){
        return Coupon.get(BASEURL+'/Haodankus/hotkeywords',null,cb);
    }

    Coupon.remoteMethod('hotkeywords', {
        accepts: [
        ],
        http: {path: '/hotkeywords', verb: 'get'},
        returns: [
            { arg: 'words', type: ['object'],root:true}
        ]
    });

    Coupon.findByNumIIDAndCouponId = function(num_iid:string,coupon_id:string,cb:Function){
        let func = async () => {
            try {
                let coupon = null;
                if (coupon_id){
                    coupon = await Coupon.get(BASEURL+'/Coupons/'+coupon_id,{filter:{include:"product"}}).catch(()=>{});
                } 
                if(coupon) return resolve(coupon,cb);
                let coupons = await Coupon.search(num_iid,true);
                if (coupons && coupons.length>0) coupon = coupons[0];
                return resolve(coupon,cb);
            } catch (err) {
                return reject(err, cb);
            }
        };
        let ret = func();
        if(!cb) return ret;
    }

    Coupon.remoteMethod('findByNumIIDAndCouponId', {
        accepts: [
            { arg: 'num_iid', type: 'string',required: true},
            { arg: 'coupon_id', type: 'string'}
        ],
        http: {path: '/findByNumIIDAndCouponId', verb: 'get'},
        returns: [
            { arg: 'coupon', type: 'Coupon',root:true}
        ]
    });
}