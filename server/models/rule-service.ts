const baseUrl = process.env.ACCOUNT_SERVICE_BASEURL;

module.exports = function(RuleService:any) {
    RuleService.getRule = function(cb: Function){
        return RuleService.get(baseUrl+'/Dictionaries/rule',cb);
    }
}