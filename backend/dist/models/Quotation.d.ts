import mongoose, { Document } from 'mongoose';
export interface IQuotation extends Document {
    name: string;
    status: 'active' | 'inactive';
    validUntil?: Date;
    description: string;
    isDefault: boolean;
    selectedServices: string[];
    createTime: Date;
    updateTime: Date;
}
declare const _default: mongoose.Model<IQuotation, {}, {}, {}, mongoose.Document<unknown, {}, IQuotation, {}, {}> & IQuotation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Quotation.d.ts.map