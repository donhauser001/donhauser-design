import { Request, Response } from 'express';
declare class ContractElementController {
    getList(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getActiveElements(req: Request, res: Response): Promise<void>;
}
declare const _default: ContractElementController;
export default _default;
//# sourceMappingURL=ContractElementController.d.ts.map