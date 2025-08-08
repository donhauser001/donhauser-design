import { IProject } from '../models/Project';
export declare class ProjectService {
    private taskService;
    private userService;
    private enterpriseService;
    getProjects(params: {
        page?: number;
        limit?: number;
        search?: string;
        progressStatus?: string;
        settlementStatus?: string;
        undertakingTeam?: string;
        clientId?: string;
        excludeStatus?: string;
    }): Promise<{
        projects: IProject[];
        total: number;
    }>;
    getProjectById(id: string): Promise<any | null>;
    createProject(projectData: {
        projectName: string;
        clientId: string;
        clientName: string;
        contactIds: string[];
        contactNames: string[];
        contactPhones: string[];
        undertakingTeam: string;
        mainDesigners: string[];
        assistantDesigners: string[];
        clientRequirements?: string;
        quotationId?: string;
        remark?: string;
        tasks?: Array<{
            taskName: string;
            serviceId: string;
            assignedDesigners: string[];
            specificationId?: string;
            quantity: number;
            unit: string;
            subtotal: number;
            pricingPolicies?: Array<{
                policyId: string;
                policyName: string;
                policyType: 'uniform_discount' | 'tiered_discount';
                discountRatio: number;
                calculationDetails: string;
            }>;
            billingDescription: string;
            priority?: 'low' | 'medium' | 'high' | 'urgent';
            dueDate?: Date;
            remarks?: string;
        }>;
        createdBy: string;
    }): Promise<IProject>;
    updateProject(id: string, updateData: {
        projectName?: string;
        clientId?: string;
        clientName?: string;
        contactIds?: string[];
        contactNames?: string[];
        contactPhones?: string[];
        undertakingTeam?: string;
        mainDesigners?: string[];
        assistantDesigners?: string[];
        progressStatus?: string;
        settlementStatus?: string;
        startedAt?: Date;
        deliveredAt?: Date;
        settledAt?: Date;
        clientRequirements?: string;
        quotationId?: string;
        remark?: string;
        updatedBy: string;
    }): Promise<IProject | null>;
    deleteProject(id: string, deletedBy: string): Promise<void>;
    updateProjectStatus(id: string, status: string, updatedBy: string): Promise<IProject | null>;
    updateSettlementStatus(id: string, status: string, updatedBy: string): Promise<IProject | null>;
    getProjectStats(): Promise<{
        total: number;
        consulting: number;
        inProgress: number;
        partialDelivery: number;
        completed: number;
        onHold: number;
        cancelled: number;
        unpaid: number;
        prepaid: number;
        partialPaid: number;
        fullyPaid: number;
    }>;
    createProjectLog(logData: {
        projectId: string;
        type: string;
        title: string;
        content: string;
        createdBy: string;
        details?: any;
    }): Promise<void>;
    getProjectLogs(projectId: string, page?: number, limit?: number): Promise<{
        logs: any[];
        total: number;
    }>;
}
declare const _default: ProjectService;
export default _default;
//# sourceMappingURL=ProjectService.d.ts.map