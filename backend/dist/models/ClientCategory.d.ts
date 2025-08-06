import mongoose, { Document } from 'mongoose';
export interface IClientCategory extends Document {
    name: string;
    description: string;
    status: 'active' | 'inactive';
    clientCount: number;
    createTime: string;
}
export interface CreateClientCategoryRequest {
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
}
export interface UpdateClientCategoryRequest {
    name?: string;
    description?: string;
    status?: 'active' | 'inactive';
}
declare const _default: mongoose.Model<IClientCategory, {}, {}, {}, mongoose.Document<unknown, {}, IClientCategory, {}, {}> & IClientCategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ClientCategory.d.ts.map