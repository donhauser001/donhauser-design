export interface Client {
    _id: string;
    name: string;
}

export interface Contact {
    _id: string;
    realName: string;
    phone: string;
    email?: string;
    username?: string;
    company?: string;
    position?: string;
}

export interface Enterprise {
    _id: string;
    enterpriseName: string;
    enterpriseAlias?: string;
    creditCode: string;
    status: 'active' | 'inactive';
}

export interface Designer {
    _id: string;
    realName: string;
    position?: string;
    role: string;
}

export interface Service {
    _id: string;
    serviceName: string;
    unitPrice: number;
    unit: string;
}

export interface Quotation {
    _id: string;
    name: string;
    status: 'active' | 'inactive';
    validUntil?: string;
    description: string;
    isDefault: boolean;
    selectedServices: string[];
    createTime: string;
    updateTime: string;
}

export interface Task {
    taskName: string;
    serviceId: string;
    assignedDesigners: string[];
    specificationId?: string;
    quantity: number;
    unit: string;
    subtotal: number;
    pricingPolicies: Array<{
        policyId: string;
        policyName: string;
        policyType: 'uniform_discount' | 'tiered_discount';
        discountRatio: number;
        calculationDetails: string;
    }>;
    billingDescription: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    remarks?: string;
}

export interface ProjectFormData {
    projectName: string;
    clientId: string;
    contactIds: string[];
    clientRequirements?: string;
    undertakingTeam: string;
    mainDesigners: string[];
    assistantDesigners: string[];
    remark?: string;
    orderNumber?: string;
    orderDate?: string;
    paymentTerms?: string;
    deliveryDate?: string;
    orderRemarks?: string;
    clientName?: string;
    contactNames?: string;
    contactPhones?: string;
} 