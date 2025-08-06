import mongoose, { Document } from 'mongoose';
export interface ITierSetting {
    id: string;
    startQuantity?: number;
    endQuantity?: number;
    minQuantity?: number;
    maxQuantity?: number;
    minAmount?: number;
    maxAmount?: number;
    discountRatio: number;
}
export interface IPricingPolicy extends Document {
    name: string;
    alias: string;
    type: 'tiered_discount' | 'uniform_discount';
    summary: string;
    validUntil: Date | null;
    discountRatio?: number;
    tierSettings?: ITierSetting[];
    status: 'active' | 'inactive';
    createTime: Date;
    updateTime: Date;
}
declare const _default: mongoose.Model<IPricingPolicy, {}, {}, {}, mongoose.Document<unknown, {}, IPricingPolicy, {}, {}> & IPricingPolicy & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=PricingPolicy.d.ts.map