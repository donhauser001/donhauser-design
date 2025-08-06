import mongoose, { Document } from 'mongoose';
export interface IPricingCategory extends Document {
    name: string;
    description: string;
    status: 'active' | 'inactive';
    serviceCount: number;
    createTime: Date;
    updateTime: Date;
}
export interface PricingCategory {
    _id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    serviceCount: number;
    createTime: string;
    updateTime: string;
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
export declare const PricingCategory: mongoose.Model<IPricingCategory, {}, {}, {}, mongoose.Document<unknown, {}, IPricingCategory, {}, {}> & IPricingCategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PricingCategory.d.ts.map