import { PricingCategory, CreatePricingCategoryRequest, UpdatePricingCategoryRequest } from '../models/PricingCategory';
export declare class PricingCategoryService {
    getCategories(): PricingCategory[];
    getCategoryById(id: string): PricingCategory | undefined;
    createCategory(data: CreatePricingCategoryRequest): PricingCategory;
    updateCategory(id: string, data: UpdatePricingCategoryRequest): PricingCategory | null;
    deleteCategory(id: string): boolean;
}
//# sourceMappingURL=PricingCategoryService.d.ts.map