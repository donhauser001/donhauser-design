import { Request, Response } from 'express';
export declare class TaskController {
    private taskService;
    constructor();
    createTask: (req: Request, res: Response) => Promise<void>;
    createTasks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTasks: (req: Request, res: Response) => Promise<void>;
    getTaskById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTasksByProject: (req: Request, res: Response) => Promise<void>;
    getTasksByDesigner: (req: Request, res: Response) => Promise<void>;
    updateTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateTaskStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    assignDesigners: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTaskStats: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=TaskController.d.ts.map