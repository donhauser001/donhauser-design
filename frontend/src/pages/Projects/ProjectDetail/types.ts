export interface Project {
    _id: string;
    projectName: string;
    clientName: string;
    clientId?: string; // 客户ID
    undertakingTeam: string;
    undertakingTeamName?: string;
    progressStatus: 'consulting' | 'in-progress' | 'partial-delivery' | 'completed' | 'on-hold' | 'cancelled';
    settlementStatus: 'unpaid' | 'prepaid' | 'partial-paid' | 'fully-paid';
    progress?: number; // 项目总进度
    createdAt: string;
    startedAt?: string;
    deliveredAt?: string;
    settledAt?: string;
    mainDesigners: string[];
    mainDesignerNames?: string[];
    assistantDesigners: string[];
    assistantDesignerNames?: string[];
    taskIds: string[];
    contactIds?: string[]; // 联系人ID数组
    contactNames: string[];
    contactPhones: string[];
    clientRequirements?: string;
    remark?: string;
}

export interface Task {
    _id: string;
    taskName: string;
    projectId: string;
    serviceId: string;
    mainDesigners: string[];
    mainDesignerNames?: string[];
    assistantDesigners: string[];
    assistantDesignerNames?: string[];
    specificationId?: string;
    specification?: {
        id: string;
        name: string;
        length: number;
        width: number;
        height?: number;
        unit: string;
        resolution?: string;
    };
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
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'urgent' | 'waiting' | 'on-hold' | 'completed';
    processStepId?: string;
    processStepName?: string;
    processSteps?: Array<{
        id: string;
        name: string;
        description: string;
        order: number;
        progressRatio: number;
        cycle: number;
    }>;
    currentProcessStep?: {
        id: string;
        name: string;
        description: string;
        order: number;
        progressRatio: number;
        cycle: number;
    };
    progress: number;
    startDate?: string;
    dueDate?: string;
    completedDate?: string;
    settlementStatus: 'unpaid' | 'prepaid' | 'draft-paid' | 'fully-paid' | 'cancelled';
    settlementTime?: string;
    remarks?: string;
    attachmentIds: string[];
    proposalId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Enterprise {
    _id: string;
    enterpriseName: string;
    enterpriseAlias?: string;
}

export interface User {
    _id: string;
    username: string;
    realName?: string;
    phone?: string;
    position?: string;
    company?: string;
} 