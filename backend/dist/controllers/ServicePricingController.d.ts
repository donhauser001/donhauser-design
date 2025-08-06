import { Request, Response } from 'express';
export declare class ServicePricingController {
    static getAllServicePricing(req: Request, res: Response): Promise<void>;
    static getServicePricingById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getServicePricingByIds(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createServicePricing(req: Request, res: Response): Promise<void>;
    static updateServicePricing(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static toggleServicePricingStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteServicePricing(req: Request, res: Response): Promise<void>;
    static searchServicePricing(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=ServicePricingController.d.ts.map