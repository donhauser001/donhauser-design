import mongoose, { Document } from 'mongoose';
export interface IClient extends Document {
    name: string;
    address: string;
    invoiceType: string;
    invoiceInfo: string;
    category: string;
    quotationId?: string;
    rating: number;
    files: Array<{
        path: string;
        originalName: string;
        size: number;
    }>;
    summary: string;
    status: 'active' | 'inactive';
    createTime: string;
    updateTime: string;
}
export interface CreateClientRequest {
    name: string;
    address: string;
    invoiceType: string;
    invoiceInfo?: string;
    category: string;
    quotationId?: string;
    rating?: number;
    files?: Array<{
        path: string;
        originalName: string;
        size: number;
    }>;
    summary?: string;
    status?: 'active' | 'inactive';
}
export interface UpdateClientRequest {
    name?: string;
    address?: string;
    invoiceType?: string;
    invoiceInfo?: string;
    category?: string;
    quotationId?: string;
    rating?: number;
    files?: Array<{
        path: string;
        originalName: string;
        size: number;
    }>;
    summary?: string;
    status?: 'active' | 'inactive';
}
export interface ClientQuery {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
}
declare const _default: mongoose.Model<IClient, {}, {}, {}, mongoose.Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Client.d.ts.map