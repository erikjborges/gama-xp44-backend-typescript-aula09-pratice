"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDatabase = void 0;
const Sequelize = __importStar(require("sequelize"));
class MysqlDatabase {
    constructor() {
        this._db = 'banco_borges';
        this._username = 'root';
        this._password = 'qweiop';
        this._host = 'host.docker.internal';
        this._dialect = 'mysql';
        this._port = 3306;
        this._adapter = new Sequelize.Sequelize(this._db, this._username, this._password, {
            host: this._host,
            dialect: this._dialect,
            port: this._port
        });
    }
    static getInstance() {
        if (!MysqlDatabase._instance) {
            MysqlDatabase._instance = new MysqlDatabase();
        }
        return MysqlDatabase._instance;
    }
    create(model, data) {
        return model.create(data);
    }
    update(type, data) {
        let obj;
        obj = data;
        if (obj.indexId === undefined)
            return false;
        this._data[type][obj.indexId] = obj;
        return obj;
    }
    list(model, includes) {
        return model.findAll(includes);
    }
    delete(type, dataId) {
        if (this._data[type] === undefined) {
            return false;
        }
        const indexId = this._data.findIndex((obj) => {
            return obj.indexId === dataId;
        });
        if (indexId === undefined)
            return false;
        this._data[type].splice(indexId, 1);
        return true;
    }
    read(model, dataId, includes) {
        return model.findByPk(dataId, includes);
    }
    createModel(name, properties) {
        return this._adapter.define(name, properties, {
            timestamps: false
        });
    }
}
exports.MysqlDatabase = MysqlDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvcGVyc2lzdGVuY2UvbXlzcWwuZGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFBdUM7QUFLdkMsTUFBYSxhQUFhO0lBV3RCO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUVsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMvRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVc7UUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7WUFDMUIsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQ25DLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBcUQsRUFBRSxJQUFTO1FBQ25FLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVksRUFBRSxJQUFTO1FBQzFCLElBQUksR0FBUSxDQUFDO1FBRWIsR0FBRyxHQUFHLElBQUksQ0FBQztRQUVYLElBQUcsR0FBRyxDQUFDLE9BQU8sS0FBSyxTQUFTO1lBQ3hCLE9BQU8sS0FBSyxDQUFDO1FBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUVwQyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBcUQsRUFBRSxRQUFnQjtRQUN4RSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFZLEVBQUUsTUFBYztRQUUvQixJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFDO1lBQzlCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRTtZQUMxQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBRyxPQUFPLEtBQUssU0FBUztZQUNwQixPQUFPLEtBQUssQ0FBQztRQUVqQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFcEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFxRCxFQUFFLE1BQWMsRUFBRSxRQUFnQjtRQUN4RixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxXQUFXLENBQUMsSUFBWSxFQUFFLFVBQXFDO1FBQzNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMxQyxVQUFVLEVBQUUsS0FBSztTQUNwQixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFuRkQsc0NBbUZDIn0=