import { IProject } from '../models/Project';
export declare class ProjectService {
    getProjects(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        team?: string;
    }): Promise<{
        projects: IProject[];
        total: number;
    }>;
    getProjectById(id: string): Promise<IProject | null>;
    createProject(projectData: {
        projectName: string;
        client: string;
        contact: string;
        team: string;
        mainDesigner: string[];
        assistantDesigners: string[];
        relatedOrders: string[];
        relatedTasks: Array<{
            serviceId: string;
            serviceName: string;
            quantity: number;
            unit: string;
            subtotal: number;
            specification?: {
                id: string;
                name: string;
                length: number;
                width: number;
                height?: number;
                unit: string;
                resolution?: string;
            };
        }>;
        clientRequirements?: string;
        startDate: Date;
    }): Promise<IProject>;
    updateProject(id: string, updateData: {
        projectName?: string;
        client?: string;
        contact?: string;
        team?: string;
        mainDesigner?: string[];
        assistantDesigners?: string[];
        relatedTaskIds?: string[];
        relatedFiles?: Array<{
            path: string;
            originalName: string;
            size: number;
        }>;
        relatedTasks?: Array<{
            serviceId: string;
            specification?: {
                id: string;
                name: string;
                length: number;
                width: number;
                height?: number;
                unit: string;
                resolution?: string;
            };
        }>;
        clientRequirements?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<IProject | null>;
    deleteProject(id: string): Promise<void>;
    updateProjectStatus(id: string, status: string): Promise<IProject | null>;
    getProjectStats(): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        onHold: number;
    }>;
}
declare const _default: ProjectService;
export default _default;
//# sourceMappingURL=ProjectService.d.ts.map