import { Request, Response } from 'express';
export declare class QuotationController {
    getAllQuotations(req: Request, res: Response): Promise<void>;
    getQuotationById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createQuotation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateQuotation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteQuotation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    toggleQuotationStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchQuotations(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: QuotationController;
export default _default;
//# sourceMappingURL=QuotationController.d.ts.map