import mongoose, { Document } from 'mongoose';
export interface IEnterprise extends Document {
    enterpriseName: string;
    enterpriseAlias?: string;
    creditCode: string;
    businessLicense: string;
    bankPermit?: string;
    bankPermitNumber?: string;
    legalRepresentative: string;
    legalRepresentativeId: string;
    companyAddress: string;
    shippingAddress: string;
    contactPerson: string;
    contactPhone: string;
    invoiceInfo: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    status: 'active' | 'inactive';
    createTime: string;
}
export declare const Enterprise: mongoose.Model<IEnterprise, {}, {}, {}, mongoose.Document<unknown, {}, IEnterprise, {}, {}> & IEnterprise & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface Enterprise {
    id: string;
    enterpriseName: string;
    enterpriseAlias?: string;
    creditCode: string;
    businessLicense: string;
    bankPermit?: string;
    bankPermitNumber?: string;
    legalRepresentative: string;
    legalRepresentativeId: string;
    companyAddress: string;
    shippingAddress: string;
    contactPerson: string;
    contactPhone: string;
    invoiceInfo: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    status: 'active' | 'inactive';
    createTime: string;
}
export interface CreateEnterpriseRequest {
    enterpriseName: string;
    enterpriseAlias?: string;
    creditCode: string;
    businessLicense: string;
    bankPermit?: string;
    bankPermitNumber?: string;
    legalRepresentative: string;
    legalRepresentativeId: string;
    companyAddress: string;
    shippingAddress: string;
    contactPerson: string;
    contactPhone: string;
    invoiceInfo: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    status: 'active' | 'inactive';
}
export interface UpdateEnterpriseRequest {
    enterpriseName?: string;
    enterpriseAlias?: string;
    creditCode?: string;
    businessLicense?: string;
    bankPermit?: string;
    bankPermitNumber?: string;
    legalRepresentative?: string;
    legalRepresentativeId?: string;
    companyAddress?: string;
    shippingAddress?: string;
    contactPerson?: string;
    contactPhone?: string;
    invoiceInfo?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    status?: 'active' | 'inactive';
}
export interface EnterpriseQuery {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=Enterprise.d.ts.map