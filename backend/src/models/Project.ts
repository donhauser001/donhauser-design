import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    projectName: string;
    client: string;
    contact: string;
    team: string; // 团队企业ID
    mainDesigner: string[]; // 主创设计师用户ID数组
    assistantDesigners: string[]; // 助理设计师用户ID数组
    relatedContracts: string[];
    relatedOrders: string[];
    relatedSettlements: string[];
    relatedInvoices: string[];
    relatedFiles: Array<{
        path: string;
        originalName: string;
        size: number;
    }>;
    relatedTaskIds: string[]; // 关联的任务ID数组
    relatedProposals: string[];
    clientRequirements?: string; // 改为可选
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
    projectName: { type: String, required: true },
    client: { type: String, required: true },
    contact: { type: String, required: true },
    team: { type: String, required: true }, // 团队企业ID
    mainDesigner: [{ type: String }], // 主创设计师用户ID数组
    assistantDesigners: [{ type: String }], // 助理设计师用户ID数组
    relatedContracts: [{ type: String }],
    relatedOrders: [{ type: String }],
    relatedSettlements: [{ type: String }],
    relatedInvoices: [{ type: String }],
    relatedFiles: [{
        path: { type: String, required: true },
        originalName: { type: String, required: true },
        size: { type: Number, required: true }
    }],
    relatedTaskIds: [{ type: String }], // 关联的任务ID数组
    relatedProposals: [{ type: String }],
    clientRequirements: { type: String }, // 改为可选
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
        default: 'pending'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
}, {
    timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema); 