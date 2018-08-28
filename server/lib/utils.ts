export var resolve = (ret: any, cb: Function) => {
    if (cb) return cb(null, ret);
    return Promise.resolve(ret);
};

export var reject = (err: any, cb: Function) => {
    if (cb) return cb(err);
    return Promise.reject(err);
};

export var pause = (milliseconds:number)=>{
    return new Promise((resolve:Function,reject:Function)=>{
        setTimeout(()=>{resolve(1)},milliseconds);
    });
};