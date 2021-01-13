import { error } from 'console';
import { pinus } from 'pinus';
import User from '../models/userModel';
import MysqlClient from './mysqlClient';

export default class UserDao {
    static hasher = require('wordpress-hash-node');
    static async userLogin(userName: string, password: string) {
        var user;
        const raw = await pinus.app.get('dbclient').aquery("CALL OH_UserLogin(?);", [userName]);
        if (!raw.err && raw.res && raw.res.length > 0) {
            user = raw.res[0][0];
            if (user.uid > 0) {
                user.isValid = this.hasher.CheckPassword(password, user.enc_pwd);
            }
        }
        return user;
    }

    static async userCreate(userInfo: any) {
        let hash = this.hasher.HashPassword(userInfo.password);
        const raw = await pinus.app.get('dbclient').aquery("CALL OH_CreateUser(?,?,?,?,@err,@msg); SELECT @err,@msg;", [userInfo.userName, hash, userInfo.nickName, userInfo.email]);
        if (!raw.err && raw.res && raw.res.length > 1) {
            return { err: raw.res[1][0]["@err"], msg: raw.res[1][0]["@msg"] };
        } else { 
            return { err: -1, msg: "数据库错误" };
        }
    }
}