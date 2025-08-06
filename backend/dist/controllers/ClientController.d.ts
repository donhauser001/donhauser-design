import { Request, Response } from 'express';
export declare class ClientController {
    static getClients(req: Request, res: Response): Promise<void>;
    static getClientById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createClient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateClient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteClient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static addClientFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static removeClientFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=ClientController.d.ts.map