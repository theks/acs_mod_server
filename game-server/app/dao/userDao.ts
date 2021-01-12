import { pinus } from 'pinus';
import User from '../models/userModel';
import MysqlClient from './mysqlClient';
import Hash_w from 'wordpress-hash-node';

export default class UserDao {

    static async userLogin(userName: string, password: string) {
        const raw = await pinus.app.get('dbclient').aquery("select * from wp_users where user_login=?", [userName]);
        if (!raw.err && raw.res && raw.res.length > 0) {
            return raw.res[0];
        }
    }

    async createUser(user: any, callback) { 
        // await this.dbclient.query("select * from wp_users where ID=1", {}, callback);
    }

    // async getUserById(uid: number): Promise<User> {
    //     MysqlClient.query("select * from wp_users where ID=:uid", { uid: uid }, function () { 
    //         let err = 0;
    //         User user = new User();
    //         return user;
    //     });
    // }
}