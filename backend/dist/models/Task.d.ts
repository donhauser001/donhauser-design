import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    taskName: string;
    serviceId: string;
    projectId: string;
    orderId?: string;
    assignedDesigners: string[];
    specification?: {
        id: string;
        name: string;
        length: number;
        width: number;
        height?: number;
        unit: string;
        resolution?: string;
    };
    quantity: number;
    unit: string;
    subtotal: number;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    progress: number;
    remarks?: string;
    attachments: string[];
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