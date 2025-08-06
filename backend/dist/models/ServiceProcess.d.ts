import mongoose, { Document } from 'mongoose';
export interface IProcessStep {
    id: string;
    name: string;
    description: string;
    order: number;
    progressRatio: number;
    lossBillingRatio: number;
    cycle: number;
}
export interface IServiceProcess extends Document {
    name: string;
    description: string;
    steps: IProcessStep[];
    status: 'active' | 'inactive';
    createTime: Date;
    updateTime: Date;
}
declare const _default: mongoose.Model<IServiceProcess, {}, {}, {}, mongoose.Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ServiceProcess.d.ts.map