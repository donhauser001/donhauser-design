import mongoose, { Document } from 'mongoose';
export interface IAdditionalConfig extends Document {
    name: string;
    description: string;
    initialDraftCount: number;
    maxDraftCount: number;
    mainCreatorRatio: number;
    assistantRatio: number;
    status: 'active' | 'inactive';
    createTime: Date;
    updateTime: Date;
}
declare const _default: mongoose.Model<IAdditionalConfig, {}, {}, {}, mongoose.Document<unknown, {}, IAdditionalConfig, {}, {}> & IAdditionalConfig & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=AdditionalConfig.d.ts.map