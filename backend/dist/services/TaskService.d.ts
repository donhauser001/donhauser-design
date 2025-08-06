import { ITask } from '../models/Task';
export declare class TaskService {
    createTask(taskData: Partial<ITask>): Promise<ITask>;
    createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]>;
    getTaskById(id: string): Promise<ITask | null>;
    getTasksByProject(projectId: string): Promise<ITask[]>;
    getTasksByDesigner(designerId: string, status?: string): Promise<ITask[]>;
    getTasks(query: {
        page?: number;
        limit?: number;
        projectId?: string;
        designerId?: string;
        status?: string;
        priority?: string;
        search?: string;
    }): Promise<{
        tasks: ITask[];
        total: number;
    }>;
    updateTask(id: string, updateData: Partial<ITask>): Promise<ITask | null>;
    updateTaskStatus(id: string, status: string, progress?: number): Promise<ITask | null>;
    assignDesigners(taskId: string, designerIds: string[]): Promise<ITask | null>;
    deleteTask(id: string): Promise<boolean>;
    deleteTasksByProject(projectId: string): Promise<number>;
    getTaskStats(projectId?: string, designerId?: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        onHold: number;
    }>;
}
//# sourceMappingURL=TaskService.d.ts.map