import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    taskName: string;
    serviceId: string;
    projectId: string;
    orderId?: string; // 改为可选
    assignedDesigners: string[]; // 分配的设计师ID数组
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
    progress: number; // 进度百分比 0-100
    remarks?: string;
    attachments: string[]; // 附件文件路径
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
    taskName: { type: String, required: true },
    serviceId: { type: String, required: true },
    projectId: { type: String, required: true },
    orderId: { type: String, required: false }, // 改为可选，因为有些任务可能不直接关联订单
    assignedDesigners: [{ type: String }],
    specification: {
        type: {
            id: { type: String },
            name: { type: String },
            length: { type: Number },
            width: { type: Number },
            height: { type: Number },
            unit: { type: String },
            resolution: { type: String }
        },
        required: false
    },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    subtotal: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    completedDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    remarks: { type: String },
    attachments: [{ type: String }]
}, {
    timestamps: true
});

// 索引
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assignedDesigners: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });

export default mongoose.model<ITask>('Task', TaskSchema); 