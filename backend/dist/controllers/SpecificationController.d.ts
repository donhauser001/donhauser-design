import { Request, Response } from 'express';
export declare class SpecificationController {
    getSpecifications(req: Request, res: Response): Promise<void>;
    getSpecificationById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createSpecification(req: Request, res: Response): Promise<void>;
    updateSpecification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteSpecification(req: Request, res: Response): Promise<void>;
    getDefaultSpecifications(req: Request, res: Response): Promise<void>;
    setDefaultSpecification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=SpecificationController.d.ts.map