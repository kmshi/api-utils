import {resolve,reject} from "../lib/utils";
var Nightmare = require('nightmare');
const Xvfb = require('xvfb');
const uuidv5 = require('uuid/v5');
var Url = require('url');
var Path = require('path');
var fs = require('fs');

const qiniu = require("qiniu");
var mac = new qiniu.auth.digest.Mac(process.env.QINIU_AK, process.env.QINIU_SK);
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

module.exports = function (Helper: any) {

    Helper.captureHTMLScreen = function(url:string,width:number,height:number,force:boolean,cb:Function){
        if (!url.startsWith('http://') && !url.startsWith('https://')){
            url = "file://" + process.cwd() + url;
        }
        let key = uuidv5(url,uuidv5.URL)+'.png';
        let outputImagePath = `/tmp/${key}`;
        key = 'screens/'+key;//bind key with prefix
        if (!width) width = 750;
        if (!height) width = 1334;

        bucketManager.stat(process.env.QINIU_BUCKET, key, function(err:any, respBody:any, respInfo:any) {
            if (err) return cb(err);
            if (respInfo.statusCode == 200 && !force) {
                respBody.url = process.env.QINIU_DOMAIN+'/'+key;
                cb(null,respBody);
            } else {
                var xvfb = new Xvfb();
                xvfb.start((err: any) => {
                    if (err) return cb(err);

                    let nightmare = new Nightmare({
                        //show: false,
                        switches: {
                            'ignore-certificate-errors': true
                        }
                    });

                    nightmare.viewport(width+36, height+36)
                        .goto(url)
                        .screenshot(outputImagePath,{x:0,y:0,width:width,height:height}) // Capture a screenshot to an image file.
                        .end() // End the Nightmare session. Any queued operations are complated and the headless browser is terminated.        
                        .then(() => {
                            //let halfUrl = qiniu.util.encodedEntry(process.env.QINIU_BUCKET,key+'-half.png');
                            var putPolicy = new qiniu.rs.PutPolicy({
                                scope: process.env.QINIU_BUCKET + ":" + key,
                                //deleteAfterDays: 30,
                                //persistentOps:'imageMogr2/auto-orient/thumbnail/!50p/interlace/1/blur/1x0/quality/75|saveas/'+halfUrl
                            });
                            let uploadToken = putPolicy.uploadToken(mac);
                            return new Promise((resolve: any, reject: any) => {
                                formUploader.putFile(uploadToken, key, outputImagePath, putExtra, (err: any,
                                    body: any, resp: any) => {
                                    if (err) return reject(err);
                                    return resolve(body);
                                });
                            });
                        })
                        .then((body:any) => {
                            xvfb.stop(() => { });
                            fs.unlinkSync(outputImagePath);
                            body.url = process.env.QINIU_DOMAIN + '/' + key;
                            cb(null, body);
                        })
                        .catch((err: any) => {
                            xvfb.stop(() => { });
                            fs.unlinkSync(outputImagePath);
                            cb(err);
                        });
                });
            }
        });
    }

    Helper.remoteMethod('captureHTMLScreen', {
        accepts: [
            {arg: 'url',type: 'string',required:true,description:'http/https,/client/appShare.html,/client/couponShare.html'},
            {arg: 'width',type: 'number', description:'h5 page width'},
            {arg: 'height',type: 'number', description:'h5 page height'},
            {arg: 'force',type: 'boolean', description:'force to recapture the screen and recreate the image'}
        ],
        http: {path: '/captureHTMLScreen', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Helper.copyRemoteFile = function(url:string,cb:Function){
        let ext = Path.extname(Url.parse(url).pathname);
        if (ext=='') ext = '.jpg';
        let key = uuidv5(url,uuidv5.URL) + ext;
        //key = 'headimgs/'+key;//bind key with prefix

        let promiseCopy = new Promise((resolve:any,reject:any)=>{
            bucketManager.stat(process.env.QINIU_BUCKET, key, function(err:any, respBody:any, respInfo:any) {
                if (err) return reject(err);
                if (respInfo.statusCode == 200) {
                    respBody.url = process.env.QINIU_DOMAIN+'/'+key;
                    resolve(respBody);
                } else {
                    bucketManager.fetch(url,process.env.QINIU_BUCKET,key,function (err:any, respBody:any, respInfo:any) {
                        if (err) return reject(err);

                        if (respInfo.statusCode == 200) {
                            respBody.url = process.env.QINIU_DOMAIN+'/'+key;
                            resolve(respBody);
                        } else {
                            reject(respInfo);
                        }
                    });
                }
            });
        });

        if (!cb) return promiseCopy;
        promiseCopy.then((ret:any)=>{cb(null,ret)}).catch((err:any)=>{cb(err)});
    }

    Helper.remoteMethod('copyRemoteFile', {
        accepts: [
            {arg: 'url',type: 'string',required:true}
        ],
        http: {path: '/copyRemoteFile', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });

    Helper.uptoken = function (key:string,cb:Function) {
        if (!key) return reject('missed parameter key',cb);
        let thumbUrl = qiniu.util.encodedEntry(process.env.QINIU_BUCKET,key+'-thumbnail');
        let options = {
            scope: process.env.QINIU_BUCKET+":"+key,
            //deleteAfterDays: 7,
            persistentOps:'imageView2/1/w/230/h/230/interlace/1/q/75|saveas/'+thumbUrl,
            //persistentNotifyUrl:"http://www.baidu.com",
            returnBody:
              '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
        };
          
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let token = putPolicy.uploadToken(mac);
        return resolve({uptoken:token, domain:process.env.QINIU_DOMAIN},cb);
    }

    Helper.remoteMethod('uptoken', {
        accepts: [
            {arg: 'key',type: 'string',required:true}
        ],
        http: {path: '/uptoken', verb: 'get'},
        returns: [
            { arg: 'info', type: 'object',root:true}
        ]
    });
}