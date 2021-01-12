import { pinus } from 'pinus';
import { preload } from './preload';
import MysqlClient from './app/dao/mysqlClient';
import { components as syncPluginPath } from 'pomelo-sync-plugin';

const HEARTBEAT = 60;
const DB_SYNC_INTERVAL = 60 * 1000;


/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = pinus.createApp();
app.set('name', 'otherworldhotel');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            heartbeat: 60,
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

// start app
app.start();

