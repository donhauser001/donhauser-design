import mongoose, { Document } from 'mongoose';
export interface IServicePricing extends Document {
    serviceName: string;
    alias: string;
    categoryId: string;
    categoryName?: string;
    unitPrice: number;
    unit: string;
    priceDescription: string;
    link: string;
    additionalConfigId?: string;
    additionalConfigName?: string;
    serviceProcessId?: string;
    serviceProcessName?: string;
    pricingPolicyIds?: string[];
    pricingPolicyNames?: string[];
    status: 'active' | 'inactive';
    createTime: Date;
    updateTime: Date;
}
declare const _default: mongoose.Model<IServicePricing, {}, {}, {}, mongoose.Document<unknown, {}, IServicePricing, {}, {}> & IServicePricing & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ServicePricing.d.ts.map