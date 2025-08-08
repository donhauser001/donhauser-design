import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    projectName: string;
    clientId: string;
    clientName: string;
    contactIds: string[];
    contactNames: string[];
    contactPhones: string[];
    undertakingTeam: string;
    mainDesigners: string[];
    assistantDesigners: string[];
    progressStatus: 'consulting' | 'in-progress' | 'partial-delivery' | 'completed' | 'on-hold' | 'cancelled';
    settlementStatus: 'unpaid' | 'prepaid' | 'partial-paid' | 'fully-paid';
    createdAt: Date;
    startedAt?: Date;
    deliveredAt?: Date;
    settledAt?: Date;
    clientRequirements?: string;
    quotationId?: string;
    remark?: string;
    taskIds: string[];
    fileIds: string[];
    contractIds: string[];
    invoiceIds: string[];
    proposalIds: string[];
    logIds: string[];
}
declare const _default: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Project.d.ts.map