# pinus-chat-example-
# pinus chatofpinus-websocket例子
> ### pomelo ts版本聊天例子，居于pinus为框架编写（pinus是pomelo ts版本，修改一些bug，优化了框架）

### windows平台

```
npm-install.bat //安装game-server，web-server模块依赖
```
### linux平台

```
npm-install.sh //安装game-server，web-server模块依赖
```

启动方法：
1、执行npm-install.bat或npm-install.sh
2、编译游戏服
cd game-server
npm run build
2、启动游戏服
cd dist
node app
显示“all servers startup in xxx ms”即表示启动成功

3、启动网页服务器
cd web-server
node app
显示“Please log on http://127.0.0.1:3001/index.html”即表示启动成功

4、进入客户端网页
浏览器输入
http://127.0.0.1:3001/index.html
点击“Test Game Server”，如返回“game server is ok.”即表示连接游戏服务器返回成功


```

### 增加一个RPC接口

```
//game.remote.gameRemote.ts
declare global {
    //UserRpc是固定的，给app.rpc添加自定义的rpc
    interface UserRpc {
        //服务器文件夹名对应路由器，注意：game只能是唯一，你不能再gate服使用game来定义
        game: {
            // 一次性定义一个类自动合并到UserRpc中
            //gameRemote是remote文件夹下的文件名，AuthRemoter 是类名 gameRemote.ts文件里面的类的名字
            gameRemote: RemoterClass<FrontendSession, AuthRemoter>;
        };
    }
}

export class AuthRemoter {
    constructor(private app: Application) {
        this.app = app;
    }

    private channelService = this.app.get("channelService");

    /**
     *
     * @param username
     * @param password
     */
    public async auth(username: string, password: string) {
        return true;
    }
    //私有方法不会加入到RPC提示里
    public async add(uid: string, sid: string, rid: string, flag: boolean) {
        let channale = this.app.get("channelService").getChannel(rid, flag); //如果没有该房间，flag为true则自动创建
        let username = uid.split('*')[0];
        var param = {
            user: username
        }

        channale.pushMessage('onAdd', param);

        if (!!channale)
            channale.add(uid, sid);

        return this.get(rid, flag)
    }
｝
```


### 特别说明
##### 项目根据pomelo版本的github.com/NetEase/chatofpomelo-websocket.git编译的TS版本


调试游戏服务器的方法：
1、安装vscode
2、在game-server目录启动vscode
3、按照正常流程启动游戏服
4、在“调试”界面，选择Attach To Connector或Attach To Master
5、按F5把调试器挂上去，然后就可以断点调试了。
