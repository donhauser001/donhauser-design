import { ITask } from '../models/Task';
declare class TaskService {
    private userService;
    private specificationService;
    private servicePricingService;
    private serviceProcessService;
    createTask(taskData: Partial<ITask>): Promise<ITask>;
    createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]>;
    getTaskById(id: string): Promise<ITask | null>;
    getTasksByProject(projectId: string): Promise<any[]>;
    getTasksByDesigner(designerId: string, status?: string): Promise<ITask[]>;
    getTasks(query: {
        page?: number;
        limit?: number;
        projectId?: string;
        designerId?: string;
        status?: string;
        priority?: string;
        settlementStatus?: string;
        search?: string;
    }): Promise<{
        tasks: ITask[];
        total: number;
    }>;
    updateTask(id: string, updateData: Partial<ITask>, updatedBy: string): Promise<ITask | null>;
    updateTaskStatus(id: string, status: string, updatedBy: string, progress?: number): Promise<ITask | null>;
    updateTaskSettlementStatus(id: string, status: string, updatedBy: string): Promise<ITask | null>;
    assignDesigners(taskId: string, mainDesignerIds: string[], assistantDesignerIds: string[], updatedBy: string): Promise<ITask | null>;
    deleteTask(id: string, deletedBy: string): Promise<boolean>;
    deleteTasksByProject(projectId: string): Promise<number>;
    getTaskStats(projectId?: string, designerId?: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        onHold: number;
        unpaid: number;
        prepaid: number;
        draftPaid: number;
        fullyPaid: number;
    }>;
    createTaskLog(logData: {
        taskId: string;
        projectId: string;
        type: string;
        title: string;
        content: string;
        createdBy: string;
        details?: any;
    }): Promise<void>;
}
export { TaskService };
declare const _default: TaskService;
export default _default;
//# sourceMappingURL=TaskService.d.ts.map