import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    projectName: string;
    client: string;
    contact: string;
    mainDesigner: string;
    assistantDesigners: string[];
    relatedContracts: string[];
    relatedOrders: string[];
    relatedSettlements: string[];
    relatedInvoices: string[];
    relatedFiles: string[];
    relatedTasks: string[];
    relatedProposals: string[];
    clientRequirements: string;
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
    mainDesigner: { type: String, required: true },
    assistantDesigners: [{ type: String }],
    relatedContracts: [{ type: String }],
    relatedOrders: [{ type: String }],
    relatedSettlements: [{ type: String }],
    relatedInvoices: [{ type: String }],
    relatedFiles: [{ type: String }],
    relatedTasks: [{ type: String }],
    relatedProposals: [{ type: String }],
    clientRequirements: { type: String, required: true },
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