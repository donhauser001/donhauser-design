import { Request, Response } from 'express';
export declare class TaskController {
    static getTasks(req: Request, res: Response): Promise<void>;
    static getTaskById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTasksByProject(req: Request, res: Response): Promise<void>;
    static getTasksByDesigner(req: Request, res: Response): Promise<void>;
    static createTask(req: Request, res: Response): Promise<void>;
    static createTasks(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateTask(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateTaskStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateTaskSettlementStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static assignDesigners(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteTask(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTaskStats(req: Request, res: Response): Promise<void>;
}
export default TaskController;
//# sourceMappingURL=TaskController.d.ts.map