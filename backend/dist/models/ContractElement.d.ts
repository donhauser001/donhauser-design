import mongoose, { Document } from 'mongoose';
export interface IContractElement extends Document {
    name: string;
    type: 'header' | 'signature' | 'order' | 'quotation' | 'short_text' | 'paragraph_text' | 'preset_text' | 'dropdown' | 'radio' | 'checkbox' | 'money' | 'money_cn' | 'number' | 'date' | 'project' | 'task';
    description?: string;
    status: 'active' | 'inactive';
    createdBy: string;
    createTime: Date;
    updateTime: Date;
}
declare const _default: mongoose.Model<IContractElement, {}, {}, {}, mongoose.Document<unknown, {}, IContractElement, {}, {}> & IContractElement & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ContractElement.d.ts.map