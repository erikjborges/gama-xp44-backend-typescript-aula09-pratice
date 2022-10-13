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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsRepository = void 0;
const mysql_database_1 = require("../../infrastructure/persistence/mysql.database");
const Sequelize = __importStar(require("sequelize"));
class ClientsRepository {
    constructor(_database) {
        this._database = _database;
        this._type = 'client';
        this._modelPessoas = this._database.createModel('pessoas', {
            indexId: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                field: 'idpessoa'
            },
            cep: Sequelize.DataTypes.STRING,
            limiteCredito: Sequelize.DataTypes.NUMBER,
            observacoes: Sequelize.DataTypes.TEXT
        });
        this._modelPessoasFisicas = this._database.createModel('pessoas_fisicas', {
            idpessoafisica: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                field: 'idpessoas_fisicas'
            },
            idpessoa: Sequelize.DataTypes.INTEGER,
            nome: Sequelize.DataTypes.STRING,
            cpf: Sequelize.DataTypes.NUMBER
        });
        this._modelPessoasJuridicas = this._database.createModel('pessoas_juridicas', {
            idpessoajuridica: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                field: 'idpessoas_juridicas'
            },
            idpessoa: Sequelize.DataTypes.INTEGER,
            razaoSocial: Sequelize.DataTypes.STRING,
            cnpj: Sequelize.DataTypes.NUMBER
        });
        this._modelEnderecos = this._database.createModel('enderecos', {
            idenderecos: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true
            },
            cep: Sequelize.DataTypes.STRING,
            logradouro: Sequelize.DataTypes.STRING,
            complemento: Sequelize.DataTypes.STRING,
            bairro: Sequelize.DataTypes.STRING,
            cidade: Sequelize.DataTypes.STRING,
            estado: Sequelize.DataTypes.STRING
        });
        this._modelPessoas.hasOne(this._modelPessoasFisicas, {
            foreignKey: 'idpessoa',
            as: 'pessoaFisica'
        });
        this._modelPessoas.hasOne(this._modelPessoasJuridicas, {
            foreignKey: 'idpessoa',
            as: 'pessoaJuridica'
        });
        this._modelPessoas.hasOne(this._modelEnderecos, {
            foreignKey: 'idpessoa',
            as: 'endereco'
        });
    }
    modelsToEntities(pessoa) {
        if (!pessoa)
            return;
        let client = {
            indexId: pessoa.indexId,
            cep: pessoa.cep,
            limiteCredito: pessoa.limiteCredito,
            observacoes: pessoa.observacoes
        };
        if (pessoa.endereco) {
            client.endereco = {
                cep: pessoa.endereco.cep,
                logradouro: pessoa.endereco.logradouro,
                complemento: pessoa.endereco.complemento,
                bairro: pessoa.endereco.bairro,
                cidade: pessoa.endereco.cidade,
                estado: pessoa.endereco.estado
            };
        }
        if (pessoa.pessoaFisica) {
            client.nome = pessoa.pessoaFisica.nome;
            client.cpf = pessoa.pessoaFisica.cpf;
        }
        else if (pessoa.pessoaJuridica) {
            client.razaoSocial = pessoa.pessoaJuridica.razaoSocial;
            client.cnpj = pessoa.pessoaJuridica.cnpj;
        }
        else {
            return;
        }
        return client;
    }
    entitiesToModels(client) {
        const pessoa = {
            indexId: client.indexId,
            cep: client.cep,
            limiteCredito: client.limiteCredito,
            observacoes: client.observacoes
        };
        let pessoaFisica = undefined;
        if ('cpf' in client) {
            pessoaFisica = {
                idpessoa: undefined,
                cpf: client.cpf,
                nome: client.nome
            };
        }
        let pessoaJuridica = undefined;
        if ('cnpj' in client) {
            pessoaJuridica = {
                idpessoa: undefined,
                cnpj: client.cnpj,
                razaoSocial: client.razaoSocial
            };
        }
        let endereco = undefined;
        if ('endereco' in client) {
            endereco = Object.assign(Object.assign({}, client.endereco), { idpessoa: undefined });
        }
        return {
            pessoa: pessoa,
            pessoaFisica: pessoaFisica,
            pessoaJuridica: pessoaJuridica,
            endereco: endereco
        };
    }
    readById(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pessoa = yield this._database.read(this._modelPessoas, resourceId, {
                include: [
                    'pessoaFisica',
                    'pessoaJuridica',
                    'endereco'
                ]
            });
            return this.modelsToEntities(pessoa);
        });
    }
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pessoa, pessoaFisica, pessoaJuridica, endereco } = this.entitiesToModels(resource);
            const pessoaModel = yield this._database.create(this._modelPessoas, pessoa);
            if (pessoaFisica) {
                console.log(pessoaModel);
                pessoaFisica.idpessoa = pessoaModel.null;
                ;
                const pessoaFisicaModel = yield this._database.create(this._modelPessoasFisicas, pessoaFisica);
            }
            if (pessoaJuridica) {
                pessoaJuridica.idpessoa = pessoaModel.null;
                const pessoaJuridicaModel = yield this._database.create(this._modelPessoasJuridicas, pessoaJuridica);
            }
            if (endereco) {
                endereco.idpessoa = pessoaModel.null;
                const enderecoModel = yield this._database.create(this._modelEnderecos, endereco);
            }
            resource.indexId = pessoaModel.null;
            return resource;
        });
    }
    deleteById(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._database.delete(this._type, resourceId);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const pessoas = yield this._database.list(this._modelPessoas, { include: [
                    'pessoaFisica',
                    'pessoaJuridica',
                    'endereco'
                ] });
            const clients = pessoas.map(this.modelsToEntities);
            return clients;
        });
    }
    updateById(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            this._database.update(this._type, resource);
            return resource;
        });
    }
}
exports.ClientsRepository = ClientsRepository;
exports.default = new ClientsRepository(mysql_database_1.MysqlDatabase.getInstance());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50cy5yZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FkYXB0ZXJzL3JlcG9zaXRvcmllcy9jbGllbnRzLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxvRkFBZ0Y7QUFFaEYscURBQXNDO0FBR3RDLE1BQWEsaUJBQWlCO0lBTzFCLFlBQW9CLFNBQXlCO1FBQXpCLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBTnJDLFVBQUssR0FBVyxRQUFRLENBQUM7UUFPN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFDdkQsT0FBTyxFQUFHO2dCQUNOLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU87Z0JBQ2pDLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixLQUFLLEVBQUUsVUFBVTthQUNwQjtZQUNELEdBQUcsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDL0IsYUFBYSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTTtZQUN6QyxXQUFXLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJO1NBQ3hDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtZQUN0RSxjQUFjLEVBQUc7Z0JBQ2IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTztnQkFDakMsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLEtBQUssRUFBRSxtQkFBbUI7YUFDN0I7WUFDRCxRQUFRLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPO1lBQ3JDLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDaEMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxT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