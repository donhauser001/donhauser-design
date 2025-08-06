import { Request, Response } from 'express';
export declare class PricingCategoryController {
    getCategories: (req: Request, res: Response) => Promise<void>;
    getCategoryById: (req: Request, res: Response) => Promise<void>;
    createCategory: (req: Request, res: Response) => Promise<void>;
    updateCategory: (req: Request, res: Response) => Promise<void>;
    deleteCategory: (req: Request, res: Response) => Promise<void>;
    toggleCategoryStatus: (req: Request, res: Response) => Promise<void>;
    searchCategories: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=PricingCategoryController.d.ts.map