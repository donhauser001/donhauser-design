import mongoose, { Document } from 'mongoose';
export interface IPricingPolicySnapshot {
    policyId: string;
    policyName: string;
    policyType: 'uniform_discount' | 'tiered_discount';
    discountRatio: number;
    calculationDetails: string;
}
export interface IOrderItemSnapshot {
    serviceId: string;
    serviceName: string;
    categoryName: string;
    unitPrice: number;
    unit: string;
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    subtotal: number;
    priceDescription: string;
    pricingPolicies: IPricingPolicySnapshot[];
}
export interface IOrderVersion extends Document {
    orderId: string;
    versionNumber: number;
    iterationTime: Date;
    clientId: string;
    clientName: string;
    contactIds: string[];
    contactNames: string[];
    contactPhones: string[];
    projectName: string;
    quotationId?: string;
    items: IOrderItemSnapshot[];
    totalAmount: number;
    totalAmountRMB: string;
    calculationSummary: {
        totalItems: number;
        totalQuantity: number;
        appliedPolicies: string[];
    };
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const OrderVersion: mongoose.Model<IOrderVersion, {}, {}, {}, mongoose.Document<unknown, {}, IOrderVersion, {}, {}> & IOrderVersion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=OrderVersion.d.ts.map