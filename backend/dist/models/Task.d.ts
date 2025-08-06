import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    taskName: string;
    projectId: string;
    serviceId: string;
    assignedDesigners: string[];
    specificationId?: string;
    quantity: number;
    unit: string;
    subtotal: number;
    pricingPolicies: Array<{
        policyId: string;
        policyName: string;
        policyType: 'uniform_discount' | 'tiered_discount';
        discountRatio: number;
        calculationDetails: string;
    }>;
    billingDescription: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    progress: number;
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    settlementStatus: 'unpaid' | 'prepaid' | 'draft-paid' | 'fully-paid' | 'cancelled';
    settlementTime?: Date;
    remarks?: string;
    attachmentIds: string[];
    proposalId?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Task.d.ts.map