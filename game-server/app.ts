import { pinus, Application, IApplicationEvent } from 'pinus';
import { preload } from './preload';
import MysqlClient from './app/dao/mysqlClient';
import { components as syncPluginPath } from 'pomelo-sync-plugin';
import UserService from './app/common/UserService';

const HEARTBEAT = 60;
const DB_SYNC_INTERVAL = 60 * 1000;



declare global {
    interface ApplicationEx extends Application {
        userService: UserService;
    }
}


/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = <ApplicationEx>pinus.createApp();
app.set('name', 'otherworldhotel');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            heartbeat: HEARTBEAT,
            useDict: true,
            useProtobuf: true
        });

    let dbclient = new MysqlClient(app);
    app.set('dbclient', dbclient);
    app.load(require(syncPluginPath + 'sync.js'), {
        path: __dirname + '/app/dao/mapping',
        dbclient: dbclient,
        interval: DB_SYNC_INTERVAL
    });
});

app.configure('production|development', 'game', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            useProtobuf: true
        });

    let dbclient = new MysqlClient(app);
    app.set('dbclient', dbclient);
    app.load(require(syncPluginPath + 'sync.js'), {
        path: __dirname + '/app/dao/mapping',
        dbclient: dbclient,
        interval: DB_SYNC_INTERVAL
    });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            useProtobuf: true
        });

    let dbclient = new MysqlClient(app);
    app.set('dbclient', dbclient);
    app.load(require(syncPluginPath + 'sync.js'), {
        path: __dirname + '/app/dao/mapping',
        dbclient: dbclient,
        interval: DB_SYNC_INTERVAL
    });
});


class EventX implements IApplicationEvent {
    start_server(serverId: string) {
        if (!app.isMaster()) {
            app.userService = new UserService(app);
        }

        // if (serverId.startsWith("login")) {
        //     app.robotService = new RobotService(app);
        // } else if (serverId.startsWith("game")) {
        //     app.roomService = new RoomService(app, <RoomConfig>{
        //         initRoomCount: 30,
        //         maxPlayer: 4,
        //         timeWaitAction: 15 * 1000,
        //     });
        // }
    }
}

app.loadEvent(EventX, null)

// start app
app.start();

