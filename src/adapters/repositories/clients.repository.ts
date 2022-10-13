import { IDatabaseModel } from "../../infrastructure/persistence/databasemodel.interface";
import { ClientEntity } from "../../domain/entities/clients/client.entity";
import { IPessoaEntity } from "../../domain/entities/clients/pessoa.entity";
import { IPessoaFisicaEntity } from "../../domain/entities/clients/pessoafisica.entity";
import { IPessoaJuridicaEntity } from "../../domain/entities/clients/pessoajuridica.entity";
import { IAddressEntity } from "../../domain/entities/clients/address.entity";
import { ArrayDatabase } from "../../infrastructure/persistence/array.database";
import { MysqlDatabase } from "../../infrastructure/persistence/mysql.database";
import { IClientsRepository } from "../../domain/repositories/clients.repository.interface";
import * as Sequelize from 'sequelize'
import { timeStamp } from "console";

export class ClientsRepository implements IClientsRepository {
    private _type: string = 'client';
    private _modelPessoas: Sequelize.ModelCtor<Sequelize.Model<any, any>>;
    private _modelPessoasFisicas: Sequelize.ModelCtor<Sequelize.Model<any, any>>;
    private _modelPessoasJuridicas: Sequelize.ModelCtor<Sequelize.Model<any, any>>;
    private _modelEnderecos: Sequelize.ModelCtor<Sequelize.Model<any, any>>;

    constructor(private _database: IDatabaseModel){
        this._modelPessoas = this._database.createModel('pessoas', {
            indexId:  {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                field: 'idpessoa'
            },
            cep: Sequelize.DataTypes.STRING,
            limiteCredito: Sequelize.DataTypes.NUMBER,
            observacoes: Sequelize.DataTypes.TEXT
        });

        this._modelPessoasFisicas = this._database.createModel('pessoas_fisicas', {
            idpessoafisica:  {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                field: 'idpessoas_fisicas'
            },
            idpessoa: Sequelize.DataTypes.INTEGER,
            nome: Sequelize.DataTypes.STRING,
            cpf: Sequelize.DataTypes.NUMBER
        });

        this._modelPessoasJuridicas = this._database.createModel('pessoas_juridicas', {
            idpessoajuridica:  {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                field: 'idpessoas_juridicas'
            },
            idpessoa: Sequelize.DataTypes.INTEGER,
            razaoSocial: Sequelize.DataTypes.STRING,
            cnpj: Sequelize.DataTypes.NUMBER
        });

        this._modelEnderecos = this._database.createModel('enderecos', {
            idenderecos:  {
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

    modelsToEntities(pessoa: any): ClientEntity | undefined {

        if(!pessoa)
            return;

        let client: IPessoaEntity = {
            indexId: pessoa.indexId,
            cep: pessoa.cep,
            limiteCredito: pessoa.limiteCredito,
            observacoes: pessoa.observacoes
        };

        if(pessoa.endereco){
            client.endereco = {
                cep: pessoa.endereco.cep,
                logradouro: pessoa.endereco.logradouro,
                complemento: pessoa.endereco.complemento,
                bairro: pessoa.endereco.bairro,
                cidade: pessoa.endereco.cidade,
                estado: pessoa.endereco.estado
            }
        }

        if(pessoa.pessoaFisica){
            (client as IPessoaFisicaEntity).nome = pessoa.pessoaFisica.nome;
            (client as IPessoaFisicaEntity).cpf = pessoa.pessoaFisica.cpf;
        } else if(pessoa.pessoaJuridica) {
            (client as IPessoaJuridicaEntity).razaoSocial = pessoa.pessoaJuridica.razaoSocial;
            (client as IPessoaJuridicaEntity).cnpj = pessoa.pessoaJuridica.cnpj;
        } else {
            return;
        }

        return (client as ClientEntity);
    }

    entitiesToModels(client: ClientEntity) {
        const pessoa = {
            indexId:  client.indexId,
            cep: client.cep,
            limiteCredito: client.limiteCredito,
            observacoes: client.observacoes
        };
        
        let pessoaFisica = undefined;
        if('cpf' in client){
            pessoaFisica = {
                idpessoa: undefined,
                cpf: client.cpf,
                nome: client.nome
            }
        }

        let pessoaJuridica = undefined;
        if('cnpj' in client){
            pessoaJuridica = {
                idpessoa: undefined,
                cnpj: client.cnpj,
                razaoSocial: client.razaoSocial
            }
        }

        let endereco = undefined;
        if('endereco' in client){
            endereco = { ...client.endereco, ...{ idpessoa: undefined } };
        }
        
        return {
            pessoa: pessoa,
            pessoaFisica: pessoaFisica,
            pessoaJuridica: pessoaJuridica,
            endereco: endereco
        };
    }

    async readById(resourceId: number): Promise<ClientEntity | undefined> {
        const pessoa = await this._database.read(this._modelPessoas, resourceId, {
            include: [
                'pessoaFisica',
                'pessoaJuridica',
                'endereco'
            ]
        });
        
        return this.modelsToEntities(pessoa);
    }

    async create(resource: ClientEntity): Promise<ClientEntity> {

        const { pessoa, pessoaFisica, pessoaJuridica, endereco } = this.entitiesToModels(resource);
        
        const pessoaModel = await this._database.create(this._modelPessoas, pessoa);
        
        if(pessoaFisica){
            console.log(pessoaModel);
            pessoaFisica.idpessoa = pessoaModel.null;;
            const pessoaFisicaModel = await this._database.create(this._modelPessoasFisicas, pessoaFisica);
        }

        if(pessoaJuridica){
            pessoaJuridica.idpessoa = pessoaModel.null;
            const pessoaJuridicaModel = await this._database.create(this._modelPessoasJuridicas, pessoaJuridica);
        }

        if(endereco){
            endereco.idpessoa = pessoaModel.null;
            const enderecoModel = await this._database.create(this._modelEnderecos, endereco);
        }
            
        resource.indexId = pessoaModel.null;

        return resource;
    }

    async deleteById(resourceId: number): Promise<void> {
        this._database.delete(this._type, resourceId);
    }

    async list(): Promise<ClientEntity[]> {
        const pessoas = await this._database.list(this._modelPessoas, { include: [
            'pessoaFisica',
            'pessoaJuridica',
            'endereco'
        ]});

        const clients = pessoas.map(this.modelsToEntities);

        return clients;
    }

    async updateById(resource: ClientEntity): Promise<ClientEntity | undefined> {
        this._database.update(this._type, resource);
        return resource;
    }
}

export default new ClientsRepository(
    MysqlDatabase.getInstance()
    );