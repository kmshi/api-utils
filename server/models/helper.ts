import {resolve,reject} from "../lib/utils";
import { CustomError } from "../lib/customError";
var Nightmare = require('nightmare');
const Xvfb = require('xvfb');
const uuidv5 = require('uuid/v5');
var Url = require('url');
const Busboy = require('busboy');
import { ReadStream } from "fs";
const AipSpeechClient = require("baidu-aip-sdk").speech;
var client = new AipSpeechClient(process.env.BAIDU_AIP_APP_ID, process.env.BAIDU_AIP_API_KEY, process.env.BAIDU_AIP_SECRET_KEY);
const os = require('os');
const fs = require('fs');
const path = require('path');
var shelljs = require('shelljs');

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
        let ext = path.extname(Url.parse(url).pathname);
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

    Helper.uploadToken = function (key:string,cb:Function) {
        if (!key) return cb('missed parameter key');
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
        cb(null,token,process.env.QINIU_DOMAIN+'/'+key,thumbUrl);
    }

    Helper.remoteMethod('uploadToken', {
        accepts: [
            {arg: 'key',type: 'string',required:true}
        ],
        http: {path: '/uploadToken', verb: 'get'},
        returns: [
            { arg: 'token', type: 'string'},
            { arg: 'picUrl', type: 'string'},
            { arg: 'thumbUrl', type: 'string'}
        ]
    });

    Helper.recognize = function (ctx:any,cb:Function) {
        const busboy = new Busboy({
            headers: ctx.req.headers
        });
        let filePaths = new Array<string>();
        let props:any = {lan:'zh'};
        busboy.on('file', (fieldname:string, file:ReadStream, filename:string, encoding:string, mimetype:string)=> {
            let key = path.basename(filename);
            let saveTo = path.join(os.tmpdir(), key);
            filePaths.push(saveTo);
            file.pipe(fs.createWriteStream(saveTo));

            var putPolicy = new qiniu.rs.PutPolicy({
                scope: process.env.QINIU_BUCKET + ":" + 'voices/' + key
            });
            let uploadToken = putPolicy.uploadToken(mac);
            formUploader.putStream(uploadToken, 'voices/' + key, file, putExtra, (err:any,
                body:any, resp:any) => {
                if (err) {
                    console.error('qiniu.putStream.err',err);
                    return;
                }
                console.log('qiniu.putStream.' + resp.statusCode,body);
                // var bucketManager = new qiniu.rs.BucketManager(mac, config);
                // bucketManager.deleteAfterDays(process.env.QINIU_BUCKET, key, 1,()=>{});//only keep 1 day
            });
        });
        busboy.on('field', (fieldname:string, val:string) => {
            props[fieldname]=val;
        });
        busboy.on('finish',()=>{
            let localFile = filePaths[0];
            let dotext = path.extname(localFile);
            if (dotext=='.silk'){
                //TODO:check how to decoder to 16000 pcm directly?
                shelljs.exec('decoder '+localFile+' '+localFile.replace(dotext,'.pcm'),(code:string,stdout:string,stderr:string)=>{
                    console.log('decoder '+localFile, +code==0?code:code + '...'+stdout+'...'+stderr);
                    shelljs.rm(localFile);//silk
                    localFile = localFile.replace(dotext,'.pcm');
                    dotext = '.pcm';
                    if (+code!=0) return cb(new CustomError(stderr,CustomError.errorCodes.BAIDU_AIP_ERROR));

                    //TODO:check the above pcm file can work without converting to wav
                    shelljs.exec('ffmpeg -i '+localFile+' -f wav -ar 16000 -ac 1 '+localFile.replace(dotext,'.wav'),(code:string,stdout:string,stderr:string)=>{
                        console.log('ffmpeg -i '+localFile, +code==0?code:code + '...'+stdout+'...'+stderr);
                        shelljs.rm(localFile);//pcm
                        localFile = localFile.replace(dotext,'.wav');
                        if (+code!=0) return cb(new CustomError(stderr,CustomError.errorCodes.BAIDU_AIP_ERROR));

                        let voice = fs.readFileSync(localFile);
                        let voiceBuffer = new Buffer(voice);
                        shelljs.rm(localFile);//wav
                        client.recognize(voiceBuffer, 'wav', 16000, {lan: props.lan}).then((res:any) =>{
                            console.log('recognize:'+ props.lan,res);
                            if(res.err_no) return cb(new CustomError(res.err_msg,CustomError.errorCodes.BAIDU_AIP_ERROR));
                            cb(null,res.result,process.env.QINIU_DOMAIN+'/voices/' +path.basename(filePaths[0]));
                        }).catch(cb);
                    });
                });
            }else{
                //TODO:check if convert to pcm directly:ffmpeg -i input.flv -f s16le -acodec pcm_s16le output.pcm
                shelljs.exec('ffmpeg -i '+localFile+' -f wav -ar 16000 -ac 1 '+localFile.replace(dotext,'.wav'),(code:string,stdout:string,stderr:string)=>{
                    console.log('ffmpeg -i '+localFile, +code==0?code:code + '...'+stdout+'...'+stderr);
                    shelljs.rm(localFile);//m4a or mp3
                    localFile = localFile.replace(dotext,'.wav');
                    if (+code!=0) return cb(new CustomError(stderr,CustomError.errorCodes.BAIDU_AIP_ERROR));

                    let voice = fs.readFileSync(localFile);
                    let voiceBuffer = new Buffer(voice);
                    shelljs.rm(localFile);//wav
                    client.recognize(voiceBuffer, 'wav', 16000, {lan: props.lan}).then((res:any) =>{
                        console.log('recognize:'+ props.lan,res);
                        if(res.err_no) return cb(new CustomError(res.err_msg,CustomError.errorCodes.BAIDU_AIP_ERROR));
                        cb(null,res.result,process.env.QINIU_DOMAIN + '/voices/' + path.basename(filePaths[0]));
                    }).catch(cb);
                });
            }
                       
        });
        ctx.req.pipe(busboy);
    };

    Helper.remoteMethod('recognize', {
        description: 'recognize a audio file by upload',
        accepts: [
            { arg: 'ctx', type: 'object', http: { source: 'context' } }
        ],
        returns: [
            { arg: 'speech', type: ['string']},
            { arg: 'voiceUrl', type: 'string'}
        ],
        http: { verb: 'post' }
    });
}