import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    orderNo: string;
    clientId: string;
    clientName: string;
    contactIds: string[];
    contactNames: string[];
    contactPhones: string[];
    projectName: string;
    quotationId?: string;
    currentVersion?: number;
    currentAmount?: number;
    currentAmountRMB?: string;
    latestVersionInfo?: {
        versionNumber: number;
        totalAmount: number;
        totalItems: number;
    };
    status: 'normal' | 'cancelled' | 'draft';
    createTime: Date;
    updateTime: Date;
    createdBy: string;
    updatedBy: string;
    paymentMethod?: string;
    deliveryDate?: Date;
    address?: string;
    remark?: string;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Order;
//# sourceMappingURL=Order.d.ts.map