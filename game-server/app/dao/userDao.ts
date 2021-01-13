import { error } from 'console';
import { pinus } from 'pinus';
import User from '../models/userModel';
import MysqlClient from './mysqlClient';

export default class UserDao {
    static hasher = require('wordpress-hash-node');
    static async userLogin(userName: string, password: string) {
        const raw = await pinus.app.get('dbclient').aquery("select * from wp_users where user_login=?;", [userName]);
        if (!raw.err && raw.res && raw.res.length > 0) {
            let user = new User();
            // todo:
            return raw.res[0];
        }
    }

    static async createUser(userInfo: any) {
        let hash = this.hasher.HashPassword(userInfo.password);
        const raw = await pinus.app.get('dbclient').aquery("CALL OH_CreateUser(?,?,?,?,@err,@msg); SELECT @err,@msg;", [userInfo.userName, hash, userInfo.nickName, userInfo.email]);
        if (!raw.err && raw.res && raw.res.length > 1) {
            return { err: raw.res[1][0]["@err"], msg: raw.res[1][0]["@msg"] };
        } else { 
            return { err: -1, msg: "数据库错误" };
        }
    }
}