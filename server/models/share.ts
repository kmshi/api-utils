import {resolve,reject} from "../lib/utils";
const BASEURL = process.env.TAOBAO_SERVICE_BASEURL;

module.exports = function (Share: any) {
    Share.findOrRetrieveByPid = function(pid:string,num_iid:string,coupon_id:string,cb:Function){
        let params = {
            pid:pid,
            num_iid:num_iid,
            coupon_id:coupon_id
        };
        return Share.get(BASEURL+'/Shares/findOrRetrieveByPid',params,cb);
    }
}