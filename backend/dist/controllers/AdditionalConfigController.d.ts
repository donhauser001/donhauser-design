import { Request, Response } from 'express';
export declare class AdditionalConfigController {
    static getAllConfigs(req: Request, res: Response): Promise<void>;
    static getConfigById(req: Request, res: Response): Promise<void>;
    static createConfig(req: Request, res: Response): Promise<void>;
    static updateConfig(req: Request, res: Response): Promise<void>;
    static toggleConfigStatus(req: Request, res: Response): Promise<void>;
    static deleteConfig(req: Request, res: Response): Promise<void>;
    static searchConfigs(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdditionalConfigController.d.ts.map