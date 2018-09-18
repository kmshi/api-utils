import {resolve,reject} from '../lib/utils';
import {stringify} from 'querystring';
const BASEURL = process.env.ACCOUNT_SERVICE_BASEURL;

module.exports = function(Account:any) {
    Account.findById = function(id:any,filter:object,cb: Function){
        return Account.get(BASEURL+'/Accounts/'+id,{filter:filter},cb);
    }

    Account.remoteMethod('findById', {
        description: 'Find a model instance by {{id}} from the data source.',
        accessType: 'READ',
        accepts: [
          {arg: 'id', type: 'any', description: 'Model id', required: true,
            http: {source: 'path'}},
          {arg: 'filter', type: 'object',
            description:
            'Filter defining fields and include - must be a JSON-encoded string (' +
            '{"something":"value"})'}
        ],
        returns: {arg: 'data', type: 'Account', root: true},
        http: {verb: 'get', path: '/:id'}
    });

    Account.findOrCreateFanByUnionId = function (unionId: string, appId: string, openId: string, userInfo: any, cb: Function) {
        return Account.post(
            BASEURL+'/Accounts/findOrCreateFanByUnionId',
            {unionId:unionId,appId:appId,openId:openId,userInfo:userInfo},
            null,
            cb
        );
    }


    Account.remoteMethod('findOrCreateFanByUnionId', {
        accepts: [
            {arg: 'unionId',type: 'string',description:"wechat unionid"},
            {arg: 'appId',type: 'string',description:"wechat appid"},
            {arg: 'openId',type: 'string',description:"wechat openid"},
            {arg: 'userInfo',type: 'object',description:'wechat userInfo object,JSON-encoded string: {"nickName":"nick","realName":"zhang san","avatorUrl":""}'}
        ],
        http: {path: '/findOrCreateFanByUnionId', verb: 'post'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.findOrCreateFanByMobilePhone = function (mobilePhone: string, code: string, cb: Function) {
        return Account.post(
            BASEURL+'/Accounts/findOrCreateFanByMobilePhone',
            {mobilePhone:mobilePhone,code:code},
            null,
            cb
        );
    }

    Account.remoteMethod('findOrCreateFanByMobilePhone', {
        accepts: [
            {arg: 'mobilePhone',type: 'string'},
            {arg: 'code',type: 'string'}
        ],
        http: {path: '/findOrCreateFanByMobilePhone', verb: 'post'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.requestSMSCode = function (mobilePhone: string, template: string, cb: Function) {
        return Account.post(
            BASEURL+'/Accounts/requestSMSCode',
            {mobilePhone:mobilePhone,template:template},
            null,
            cb
        );
    }

    Account.remoteMethod('requestSMSCode', {
        accepts: [
            {arg: 'mobilePhone',type: 'string'},
            {arg: 'template',type: 'string',description:'MP_LOGIN,MP_BIND,ALIPAY_BIND'}
        ],
        http: {path: '/requestSMSCode', verb: 'post'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Account.bindMobilePhone = function (id:any,mobilePhone: string, code: string, cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/bindMobilePhone',
            {mobilePhone:mobilePhone,code:code},
            null,
            cb
        );
    }

    Account.remoteMethod('bindMobilePhone', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'mobilePhone',type: 'string'},
            {arg: 'code',type: 'string'}
        ],
        http: {path: '/:id/bindMobilePhone', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.bindAlipayAndMobilePhone = function (id:any,realName: string, alipay: string, mobilePhone: string, code: string, cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/bindAlipayAndMobilePhone',
            {realName:realName,alipay:alipay,mobilePhone:mobilePhone,code:code},
            null,
            cb
        );
    }

    Account.remoteMethod('bindAlipayAndMobilePhone', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'realName',type: 'string'},
            {arg: 'alipay',type: 'string'},
            {arg: 'mobilePhone',type: 'string'},
            {arg: 'code',type: 'string'}
        ],
        http: {path: '/:id/bindAlipayAndMobilePhone', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.updateChannelId = function (id:any,channel_id: string, isAndroid: boolean, cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/updateChannelId',
            {channel_id:channel_id,isAndroid:isAndroid},
            null,
            cb
        );
    }

    Account.remoteMethod('updateChannelId', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'channel_id',type: 'string'},
            {arg: 'isAndroid',type: 'boolean'}
        ],
        http: {path: '/:id/updateChannelId', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.withdraw = function (id:any,amount: string, wxAppId: string, cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/withdraw',
            {amount:amount,wxAppId:wxAppId},
            null,
            cb
        );
    }

    Account.remoteMethod('withdraw', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'amount',type: 'string'},
            {arg: 'wxAppId',type: 'string'}
        ],
        http: {path: '/:id/withdraw', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.todayReport = function (id:any,cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/todayReport',
            null,
            cb
        );
    }

    Account.remoteMethod('todayReport', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        http: {path: '/:id/todayReport', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Account.yesterdayReport = function (id:any,cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/yesterdayReport',
            null,
            cb
        );
    }

    Account.remoteMethod('yesterdayReport', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        http: {path: '/:id/yesterdayReport', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Account.getDirectOrders = function (id:any,page_no: number,page_size:number,status:number,cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getDirectOrders',
            {page_no:page_no,page_size:page_size,status:status},
            cb
        );
    }

    Account.remoteMethod('getDirectOrders', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'page_num',type: 'number'},
            {arg: 'page_size',type: 'number'},
            {arg: 'status',type: 'number',description:'0(null):ALL,3:订单结算,12:订单付款,13:订单失效'}
        ],
        http: {path: '/:id/getDirectOrders', verb: 'get'},
        returns: [
            { arg: 'trades', type: ['Trade'],root:true}
        ]
    });

    Account.getRelationOrders = function (id:any,page_no: number,page_size:number,status:number, cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getRelationOrders',
            {page_no:page_no,page_size:page_size,status:status},
            cb
        );
    }

    Account.remoteMethod('getRelationOrders', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'page_num',type: 'number'},
            {arg: 'page_size',type: 'number'},
            {arg: 'status',type: 'number',description:'0(null):ALL,3:订单结算,12:订单付款,13:订单失效'}
        ],
        http: {path: '/:id/getRelationOrders', verb: 'get'},
        returns: [
            { arg: 'trades', type: ['Trade'],root:true}
        ]
    });

    Account.getTeamOrders = function (id:any,page_no: number,page_size:number,status:number, cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getTeamOrders',
            {page_no:page_no,page_size:page_size,status:status},
            cb
        );
    }

    Account.remoteMethod('getTeamOrders', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'page_num',type: 'number'},
            {arg: 'page_size',type: 'number'},
            {arg: 'status',type: 'number',description:'0(null):ALL,3:订单结算,12:订单付款,13:订单失效'}
        ],
        http: {path: '/:id/getTeamOrders', verb: 'get'},
        returns: [
            { arg: 'trades', type: ['Trade'],root:true}
        ]
    });

    Account.getLevel1Children = function (id:any,page_no:number,page_size:number,type:number,cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getLevel1Children',
            {page_no:page_no,page_size:page_size,type:type},
            cb
        );
    }

    Account.remoteMethod('getLevel1Children', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'page_no',type: 'number'},
            {arg: 'page_size',type: 'number'},
            {arg: 'type',type: 'number',description:"null/0:all,1:fan,2:member"}
        ],
        http: {path: '/:id/getLevel1Children', verb: 'get'},
        returns: [
            { arg: 'accounts', type: ['Account'],root:true}
        ]
    });
/*
    Account.getLevel2Children = function (id:any,cb: Function) {
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getLevel2Children',
            null,
            cb
        );
    }

    Account.remoteMethod('getLevel2Children', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        http: {path: '/:id/getLevel2Children', verb: 'get'},
        returns: [
            { arg: 'accounts', type: ['Account'],root:true}
        ]
    });
*/
    Account.getBills = function(id:any,page_no:number,page_size:number,cb:Function){
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getBills',
            {page_no:page_no,page_size:page_size},
            cb
        );
    }

    Account.remoteMethod('getBills', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        http: {path: '/:id/getBills', verb: 'get'},
        returns: [
            { arg: 'bills', type: ['Bill'],root:true}
        ]
    });

    Account.getNotifications = function(id:any,messageTypes:string,autoMarkRead:boolean,page_no:number,page_size:number,cb:Function){
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getNotifications',
            {messageTypes:messageTypes,autoMarkRead:autoMarkRead,page_no:page_no,page_size:page_size},
            cb
        );
    }

    Account.remoteMethod('getNotifications', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'messageTypes', type: 'string', description:'ACCOUNT,WITHDRAW,EARNING,SYSTEM (support multiple types seperated by ",")'},
            {arg: 'autoMarkRead',type: 'boolean',description:'auto mark those notifications'},
            {arg: 'page_no',type: 'number',description:'第几页，默认：１'},
            {arg: 'page_size',type: 'number',description:'页大小，默认20，1~100'},
        ],
        http: {path: '/:id/getNotifications', verb: 'get'},
        returns: [
            { arg: 'notifications', type: ['Notification'],root:true}
        ]
    });

    Account.getNotificationsUnreadCount = function(id:any,messageTypes:string,cb:Function){
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getNotificationsUnreadCount',
            {messageTypes:messageTypes},
            cb
        );
    }

    Account.remoteMethod('getNotificationsUnreadCount', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'messageTypes', type: 'string', description:'ACCOUNT/WITHDRAW/EARNING/SYSTEM,support multiple types seperated by ","'},
        ],
        http: {path: '/:id/getNotificationsUnreadCount', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Account.checkinRedbag = function(id:any,cb:Function){
        return Account.put(
            BASEURL+'/Accounts/'+id+'/checkinRedbag',
            null,
            null,
            cb
        );
    }

    Account.remoteMethod('checkinRedbag', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        description:'check in and return a new redbag',
        http: {path: '/:id/checkinRedbag', verb: 'put'},
        returns: [
            { arg: 'redbag', type: 'Redbag',root:true}
        ]
    });

    Account.answerQuestionaireRedbag = function(id:any,numOfCorrect:number,cb:Function){
        return Account.put(
            BASEURL+'/Accounts/'+id+'/answerQuestionaireRedbag',
            {numOfCorrect:numOfCorrect},
            null,
            cb
        );
    }

    Account.remoteMethod('answerQuestionaireRedbag', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'numOfCorrect',type: 'number'},
        ],
        description:'answer questionaire and return a new redbag',
        http: {path: '/:id/answerQuestionaireRedbag', verb: 'put'},
        returns: [
            { arg: 'redbag', type: 'Redbag',root:true}
        ]
    });

    Account.getPrivateRedbags = function(id:any,cb:Function){
        return Account.get(
            BASEURL+'/Accounts/'+id+'/getPrivateRedbags',
            null,
            cb
        );
    }

    Account.remoteMethod('getPrivateRedbags', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        description:'get redbags related to trade',
        http: {path: '/:id/getPrivateRedbags', verb: 'get'},
        returns: [
            { arg: 'redbags', type: ['Redbag'],root:true}
        ]
    });

    Account.openRedbag = function(id:any,redbagId:string,answer:any,cb:Function){
        return Account.put(
            BASEURL+'/Accounts/'+id+'/openRedbag',
            {redbagId:redbagId,answer:answer},
            null,
            cb
        );
    }

    Account.remoteMethod('openRedbag', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'redbagId',type: 'string'},
            {arg: 'answer',type: 'object',description:"JSON encoded string:{}"},
        ],
        description:'open a redbag by redbagId,and get your redpack with money',
        http: {path: '/:id/openRedbag', verb: 'put'},
        returns: [
            { arg: 'redpack', type: 'Redpack',root:true}
        ]
    });

    Account.upgradeToMember = function (id:any,cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/upgradeToMember',
            null,
            null,
            cb
        );
    }

    Account.remoteMethod('upgradeToMember', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        http: {path: '/:id/upgradeToMember', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.buildMappingByParentInviteCode = function (id:any,inviteCode: string, cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/buildMappingByParentInviteCode',
            {inviteCode:inviteCode},
            null,
            cb
        );
    }

    Account.remoteMethod('buildMappingByParentInviteCode', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'inviteCode',type: 'string'}
        ],
        http: {path: '/:id/buildMappingByParentInviteCode', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.buildMappingByParentMobilePhone = function (id:any,mobilePhone: string, cb: Function) {
        return Account.put(
            BASEURL+'/Accounts/'+id+'/buildMappingByParentMobilePhone',
            {mobilePhone:mobilePhone},
            null,
            cb
        );
    }

    Account.remoteMethod('buildMappingByParentMobilePhone', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'mobilePhone',type: 'string'}
        ],
        http: {path: '/:id/buildMappingByParentMobilePhone', verb: 'put'},
        returns: [
            { arg: 'account', type: 'Account',root:true}
        ]
    });

    Account.rate = function(id:any,cb:Function){
        return Account.get(
            BASEURL+'/Accounts/'+id+'/rate',
            null,
            cb
        );
    }

    Account.remoteMethod('rate', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
        ],
        http: {path: '/:id/rate', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Account.shareInfo = function(id:any,num_iid:string,coupon_id:string,cb:Function){
        let func = async () => {
            try {
                let info = {
                    pid:"",
                    tpwd:"",
                    coupon_click_url:"",
                    max_commission_rate:0
                };

                let account = await Account.findById(id);
                info.pid = account.pid_taobao;
                if (!info.pid){
                    let pidData = await Account.get(BASEURL+'/Accounts/'+id+'/getParentTaobaoPid');
                    info.pid = pidData.pid;
                }

                if (!!num_iid){
                    let shareData = await Account.app.models.Share.findOrRetrieveByPid(info.pid,num_iid,coupon_id);
                    info.tpwd = shareData.tpwd;
                    info.coupon_click_url = shareData.coupon_click_url;
                    info.max_commission_rate = shareData.max_commission_rate;
                    info.pid = shareData.pid;
                }
                
                return resolve(info,cb);
            } catch (err) {
                return reject(err, cb);
            }
        };
        let ret = func();
        if(!cb) return ret;
    }

    Account.remoteMethod('shareInfo', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'num_iid',type: 'string'},
            {arg: 'coupon_id',type: 'string'},
        ],
        http: {path: '/:id/shareInfo', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Account.getCouponShareImageAndLink = function(id:any,num_iid:string,coupon_id:string,force:boolean,cb:Function){
        let func = async () => {
            try {
                let data = null;
                let info = await Account.shareInfo(id,num_iid,coupon_id);
                let coupon = await Account.app.models.Coupon.findByNumIIDAndCouponId(num_iid,coupon_id);
                if (coupon){
                    let params:any = {
                        picUrl:coupon.product.pict_url,
                        title:coupon.product.title,
                        zk_final_price:coupon.product.zk_final_price,
                        coupon_amount:coupon.coupon_amount,
                        isTmall:coupon.product.user_type,
                        tpwd:info.tpwd,
                        num_iid:num_iid,
                        //coupon_click_url:info.coupon_click_url
                    };

                    let urlData = await Account.app.models.Domain.random();
                    params.shareUrl = urlData.url+'/couponShare.html?'+stringify(params);

                    let url = "file://"+process.cwd()+"/client/couponShare.html?"+stringify(params);
                    let ret = await Account.get(BASEURL+'/Accounts/captureHTMLScreen',{url:url,force:force});
                    
                    data = {shareImageUrl:ret.url,shareUrl:params.shareUrl}
                }
                return resolve(data,cb);
            } catch (err) {
                return reject(err, cb);
            }
        };
        let ret = func();
        if(!cb) return ret;    
    }

    Account.remoteMethod('getCouponShareImageAndLink', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'num_iid',type: 'string'},
            {arg: 'coupon_id',type: 'string'},
            {arg: 'force',type: 'boolean', description:'force to recapture the screen and recreate the image'}
        ],
        http: {path: '/:id/getCouponShareImageAndLink', verb: 'get'},
        returns: [
            { arg: 'data', type: 'object',root:true}
        ]
    });

    Account.getAppShareImageAndLink = function(id:any,picUrl:string,force:boolean,cb:Function){
        let func = async () => {
            try {
                let account = await Account.findById(id);
                let domain = await Account.app.models.Domain.random();
                let params = {
                    picUrl: picUrl,
                    shareUrl: domain.url + '/appShare.html?inviteCode=' + account.inviteCode
                };
                let url = "file://" + process.cwd() + "/client/appShare.html?" + stringify(params);

                let ret = await Account.get(BASEURL + '/Accounts/captureHTMLScreen', { url: url, width: 750, height: 1334, force: force });
                return resolve({shareUrl:params.shareUrl,shareImageUrl:ret.url},cb);
            } catch (err) {
                return reject(err, cb);
            }
        };
        let ret = func();
        if(!cb) return ret;
    }

    Account.remoteMethod('getAppShareImageAndLink', {
        accepts: [
            {arg: 'id', type: 'any', description: 'Model id', required: true,http: {source: 'path'}},
            {arg: 'picUrl', type: 'string',description:"background image url"},
            {arg: 'force',type: 'boolean', description:'force to recapture the screen and recreate the image'}
        ],
        http: {path: '/:id/getAppShareImageAndLink', verb: 'get'},
        returns: [
            { arg: 'data', type: 'object',root:true}
        ]
    });

    Account.getPostImageUrls = function(cb:Function){
        cb(
            null,
            [
                "http://friends.coolhuo.cn/posts/post1.jpg",
                "http://friends.coolhuo.cn/posts/post2.jpg",
                "http://friends.coolhuo.cn/posts/post3.jpg",
                "http://friends.coolhuo.cn/posts/post4.jpg"
            ]
        );
    }

    Account.remoteMethod('getPostImageUrls', {
        accepts: [
        ],
        http: {path: '/getPostImageUrls', verb: 'get'},
        returns: [
            { arg: 'urls', type: ['string'],root:true}
        ]
    });

    Account.getMasterWechatId = function(cb:Function){
        cb(null,'zu_hu_me');
    }

    Account.remoteMethod('getMasterWechatId', {
        accepts: [
        ],
        http: {path: '/getMasterWechatId', verb: 'get'},
        returns: [
            { arg: 'wechatId', type: 'string'}
        ]
    });
}