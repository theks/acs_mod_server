import { Application, FrontendSession } from 'pinus';
import { Session } from 'inspector';
import { Promise } from 'bluebird';
import UserDao from '../../../dao/userDao';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {
        this.app = app;
    }

    //查询入口（connector）
    async queryEntry(msg:any, Session:FrontendSession){
        let uid = msg.uid;

        if(!uid){
            return {code:500}
        }

        let connectors = this.app.getServersByType('connector');

        if(!connectors || connectors.length === 0) {
            return {code:500};
        }

        let res = connectors[0]

        return {code:200,host:res.clientHost,port:res.clientPort}
    }

    //登录并查询入口
    async userLogin(info: any) {
        let userInfo = await UserDao.userLogin(info.uname, info.pwd);
        return userInfo;
    }

    //新用户注册
    async register(info: any) {
        let code = 0, msg = "";
        if (!(/^\w{4,16}$/).test(info.userName)) {
            return { code: 500, msg: "用户名只能由4-16位英文字母、数字、下划线组成" };
        }
        if (info.password.length < 6 || info.password.length > 16) {
            return { code: 500, msg: "密码长度不能少于6位或超过16位" };
        }
        if (!(/^[\w\u4E00-\u9FA5]{2,8}$/).test(info.nickName)) {
            return { code: 500, msg: "昵称只能由2-8位中英文字符、数字、下划线组成" };
        }
        if (!(/^[\w-]+@[\w-]+(\.[\w-]+)+$/).test(info.email)) {
            return { code: 500, msg: "电子邮箱格式不正确" };
        }

        let ret = await UserDao.createUser(info);
        if (ret.err < 0) {
            return { code: 500, msg: ret.msg };
        } else {
            return { code: 200 };
        }
    }

}