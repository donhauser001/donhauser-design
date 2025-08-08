import mongoose, { Document } from 'mongoose';
export interface IProjectLog extends Document {
    projectId: string;
    type: 'status_change' | 'team_change' | 'task_update' | 'settlement' | 'file_upload' | 'remark' | 'system';
    title: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    details?: {
        oldValue?: any;
        newValue?: any;
        relatedIds?: string[];
    };
}
declare const _default: mongoose.Model<IProjectLog, {}, {}, {}, mongoose.Document<unknown, {}, IProjectLog, {}, {}> & IProjectLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ProjectLog.d.ts.map