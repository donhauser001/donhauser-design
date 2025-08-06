import { IClient, CreateClientRequest, UpdateClientRequest, ClientQuery } from '../models/Client';
export declare class ClientService {
    static getClients(query?: ClientQuery): Promise<{
        data: IClient[];
        total: number;
    }>;
    static getClientById(id: string): Promise<IClient | null>;
    static createClient(clientData: CreateClientRequest): Promise<IClient>;
    static updateClient(id: string, clientData: UpdateClientRequest): Promise<IClient | null>;
    static deleteClient(id: string): Promise<boolean>;
    static addClientFile(clientId: string, fileInfo: {
        path: string;
        originalName: string;
        size: number;
    }): Promise<boolean>;
    static removeClientFile(clientId: string, filePath: string): Promise<boolean>;
}
//# sourceMappingURL=ClientService.d.ts.map