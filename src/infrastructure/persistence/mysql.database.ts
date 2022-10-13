import * as Sequelize from 'sequelize';


import { IDatabaseModel } from "./databasemodel.interface";

export class MysqlDatabase implements IDatabaseModel {
    private _data: any;
    private static _instance: MysqlDatabase;
    private _db: string;
    private _username: string;
    private _password: string;
    private _host: string;
    private _dialect: Sequelize.Dialect;
    private _port: number;
    private _adapter: Sequelize.Sequelize;

    private constructor(){
        this._db = 'banco_borges';
        this._username = 'root';
        this._password = 'qweiop';
        this._host = 'host.docker.internal';
        this._dialect = 'mysql';
        this._port = 3306;

        this._adapter = new Sequelize.Sequelize(this._db, this._username , this._password, {
            host: this._host,
            dialect: this._dialect,
            port: this._port
        });
    }

    public static getInstance(): MysqlDatabase {
        if (!MysqlDatabase._instance) {
            MysqlDatabase._instance = new MysqlDatabase();
        }

        return MysqlDatabase._instance;
    }

    create(model: Sequelize.ModelCtor<Sequelize.Model<any, any>>, data: any): any {
        return model.create(data);
    }

    update(type: string, data: any): boolean {
        let obj: any;
        
        obj = data;

        if(obj.indexId === undefined)
            return false;
        
        this._data[type][obj.indexId] = obj;

        return obj;
    }

    list(model: Sequelize.ModelCtor<Sequelize.Model<any, any>>, includes: object): any {
        return model.findAll(includes);
    }

    delete(type: string, dataId: number): boolean {

        if(this._data[type] === undefined){
            return false;
        }

        const indexId = this._data.findIndex((obj: any) => {
                return obj.indexId === dataId;
        });
        

        if(indexId === undefined)
            return false;

        this._data[type].splice(indexId, 1);

        return true;
    }

    read(model: Sequelize.ModelCtor<Sequelize.Model<any, any>>, dataId: number, includes: object): any {
        return model.findByPk(dataId, includes);
    }

    createModel(name: string, properties: Sequelize.ModelAttributes): Sequelize.ModelCtor<Sequelize.Model<any, any>> {
        return this._adapter.define(name, properties, {
            timestamps: false
        });
    }
}