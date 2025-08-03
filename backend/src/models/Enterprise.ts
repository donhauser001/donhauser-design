import mongoose, { Schema, Document } from 'mongoose'

export interface IEnterprise extends Document {
    enterpriseName: string;
    creditCode: string;
    businessLicense: string;
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

const EnterpriseSchema = new Schema<IEnterprise>({
    enterpriseName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    creditCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    businessLicense: {
        type: String,
        trim: true
    },
    legalRepresentative: {
        type: String,
        required: true,
        trim: true
    },
    legalRepresentativeId: {
        type: String,
        required: true,
        trim: true
    },
    companyAddress: {
        type: String,
        required: true,
        trim: true
    },
    shippingAddress: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true
    },
    invoiceInfo: {
        type: String,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },
    accountName: {
        type: String,
        trim: true
    },
    accountNumber: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        index: true
    },
    createTime: {
        type: String,
        default: () => new Date().toLocaleString()
    }
}, {
    timestamps: true
})

export const Enterprise = mongoose.model<IEnterprise>('Enterprise', EnterpriseSchema)

export interface Enterprise {
    id: string;
    enterpriseName: string;
    creditCode: string;
    businessLicense: string;
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
    creditCode: string;
    businessLicense: string;
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
    creditCode?: string;
    businessLicense?: string;
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