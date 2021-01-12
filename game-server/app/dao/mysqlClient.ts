import { Application } from "pinus";
import { Promise } from 'bluebird';
import * as PoolManager from "mysql-connection-pool-manager";
import AppConfigs from '../../config/appConfigs';

const mysql = require("mysql");
/**
 * 封装msyql操作的工具类
 */
export default class MysqlClient {
    private mySQL: any;

    constructor(private app: Application) {
        const options = {
            idleCheckInterval: 1000,
            maxConnextionTimeout: 30000,
            idlePoolTimeout: 3000,
            errorLimit: 5,
            preInitDelay: 50,
            sessionTimeout: 60000,
            onConnectionAcquire: () => { },
            onConnectionConnect: () => { },
            onConnectionEnqueue: () => { },
            onConnectionRelease: () => { },
            mySQLSettings: AppConfigs.MysqlConfig
        };

        this.mySQL = PoolManager(options);
    }

    query(sql: string, params: any, cb: (res: any, err: string) => void) {
        let queryStr = mysql.format(sql, params);
        this.mySQL.query(queryStr, cb);
    }

    async aquery(sql: string, params: any) {
        return new Promise((resolve, reject) => {
            this.query(sql, params, (res, err) => {
                resolve({ res, err });
            });
        });
    }
}