import { Request, Response } from 'express';
export declare class EnterpriseController {
    private enterpriseService;
    getEnterprises(req: Request, res: Response): Promise<void>;
    getEnterpriseById(req: Request, res: Response): Promise<void>;
    createEnterprise(req: Request, res: Response): Promise<void>;
    updateEnterprise(req: Request, res: Response): Promise<void>;
    deleteEnterprise(req: Request, res: Response): Promise<void>;
    toggleEnterpriseStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=EnterpriseController.d.ts.map