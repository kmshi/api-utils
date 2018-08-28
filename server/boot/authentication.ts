import { BootScript } from '@mean-expert/boot-script';
const basicAuth = require('express-basic-auth');

@BootScript()
class Authentication {
    constructor(app: any) {
        //app.enableAuth();

        const app_name = require('../../package.json').name;
        const username = process.env.BASIC_AUTH_NAME || 'admin';
        const password = process.env.BASIC_AUTH_PASSWORD || 'supersecret';
        const user:any = {};
        user[username] = password;
        app.use(basicAuth({
			users: user,
			challenge: true,
		    realm: app_name
		}));
    }
}

module.exports = Authentication;