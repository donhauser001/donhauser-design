import { Request, Response } from 'express';
export declare class ProjectController {
    getProjects(req: Request, res: Response): Promise<void>;
    getProjectById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createProject(req: Request, res: Response): Promise<void>;
    updateProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteProject(req: Request, res: Response): Promise<void>;
    updateProjectStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProjectStats(req: Request, res: Response): Promise<void>;
    getProjectTasks(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ProjectController.d.ts.map