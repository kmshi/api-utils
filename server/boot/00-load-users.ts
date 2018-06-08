import { BootScript } from '@mean-expert/boot-script';
import {ROLES} from '../../common/const';

function createDefaultUsers(app: any) {

    console.log('Creating roles and users');

    var User = app.models.Customer;
    var Role = app.models.Role;

    var RoleMapping = app.models.RoleMapping;
    RoleMapping.settings.strictObjectIDCoercion = true;

    var roles = [{
      name: ROLES.SU,
      users: [{
        nickName: 'Root',
        email: 'root@kujia.cn',
        username: '13556174217',
        password: process.env.SU_PASSWORD||'root11'
      }]
    }];

    roles.forEach(function(role) {
      Role.findOrCreate(
        {where: {name: role.name}}, // find
        {name: role.name}, // create
        function(err:any, createdRole:any, created:boolean) {
          if (err) {
            console.log('error running findOrCreate('+role.name+')');
            return;
          }
          (created) ? console.log('created role', createdRole.name)
                    : console.log('found role', createdRole.name);
          role.users.forEach(function(roleUser:any) {
            User.findOrCreate(
              {where: {username: roleUser.username}}, // find
              roleUser, // create
              function(err:any, createdUser:any, created:boolean) {
                if (err) {
                  console.log('error creating roleUser');
                  return;
                }
                (created) ? console.log('created user', createdUser.username)
                          : console.log('found user', createdUser.username);
                if (created){
                  createdRole.principals.create({
                    principalType: app.models.RoleMapping.USER,
                    principalId: createdUser.id
                  });
                }
              });
          });
        });
    });
}


@BootScript()
class LoadUsers {
    constructor(app: any) {
      app.on('started', () => {
        createDefaultUsers(app);
      });    	
    }
}

module.exports = LoadUsers;
