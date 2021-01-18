import { pinus } from 'pinus';
import { preload } from './preload';
import MysqlClient from './app/dao/mysqlClient';
import { components as syncPluginPath } from 'pomelo-sync-plugin';

import _pinus = require('pinus');

const HEARTBEAT = 60;
const DB_SYNC_INTERVAL = 60 * 1000;

const filePath = (_pinus as any).FILEPATH;
filePath.MASTER = '/config/master';
filePath.SERVER = '/config/servers';
filePath.CRON = '/config/crons';
filePath.LOG = '/config/log4js';
filePath.SERVER_PROTOS = '/config/serverProtos';
filePath.CLIENT_PROTOS = '/config/clientProtos';
filePath.MASTER_HA = '/config/masterha';
filePath.LIFECYCLE = '/lifecycle';
filePath.SERVER_DIR = '/app/servers/';
filePath.CONFIG_DIR = '/config';

const adminfilePath = _pinus.DEFAULT_ADMIN_PATH;
adminfilePath.ADMIN_FILENAME = 'adminUser';
adminfilePath.ADMIN_USER = 'config/adminUser';

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

