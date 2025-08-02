export interface PricingCategory {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    serviceCount: number;
    createTime: string;
}
export interface CreatePricingCategoryRequest {
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
}
export interface UpdatePricingCategoryRequest {
    name?: string;
    description?: string;
    status?: 'active' | 'inactive';
}
//# sourceMappingURL=PricingCategory.d.ts.map