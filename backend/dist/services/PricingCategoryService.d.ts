import { PricingCategory, CreatePricingCategoryRequest, UpdatePricingCategoryRequest } from '../models/PricingCategory';
export declare class PricingCategoryService {
    static getCategories(): Promise<PricingCategory[]>;
    static getCategoryById(id: string): Promise<PricingCategory | null>;
    static createCategory(data: CreatePricingCategoryRequest): Promise<PricingCategory>;
    static updateCategory(id: string, data: UpdatePricingCategoryRequest): Promise<PricingCategory | null>;
    static deleteCategory(id: string): Promise<boolean>;
    static toggleCategoryStatus(id: string): Promise<PricingCategory | null>;
    static updateServiceCount(id: string, count: number): Promise<void>;
    static searchCategories(searchTerm: string): Promise<PricingCategory[]>;
}
//# sourceMappingURL=PricingCategoryService.d.ts.map