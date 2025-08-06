import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    projectName: string;
    client: string;
    contact: string;
    team: string;
    mainDesigner: string[];
    assistantDesigners: string[];
    relatedContracts: string[];
    relatedOrders: string[];
    relatedSettlements: string[];
    relatedInvoices: string[];
    relatedFiles: Array<{
        path: string;
        originalName: string;
        size: number;
    }>;
    relatedTaskIds: string[];
    relatedProposals: string[];
    clientRequirements?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Project.d.ts.map