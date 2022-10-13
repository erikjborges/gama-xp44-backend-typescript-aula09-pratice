export interface IDatabase {
    list(type: any): any[],
    create(type: any, data: any): any,
    read(type: any, dataId: number): any,
    update(type: string, data: any): boolean,
    delete(type: string, dataId: number): boolean
}