import { Request, Response } from 'express';
export declare class OrderVersionController {
    createOrderVersion(req: Request, res: Response): Promise<void>;
    getOrderVersions(req: Request, res: Response): Promise<void>;
    getOrderVersion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getLatestOrderVersion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteOrderVersions(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=OrderVersionController.d.ts.map