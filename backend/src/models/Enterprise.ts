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