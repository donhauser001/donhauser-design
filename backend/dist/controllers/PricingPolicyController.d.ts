import { Request, Response } from 'express';
export declare class PricingPolicyController {
    static getAllPolicies(req: Request, res: Response): Promise<void>;
    static getPolicyById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createPolicy(req: Request, res: Response): Promise<void>;
    static updatePolicy(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static togglePolicyStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deletePolicy(req: Request, res: Response): Promise<void>;
    static searchPolicies(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=PricingPolicyController.d.ts.map