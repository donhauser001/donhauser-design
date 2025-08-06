import { Request, Response } from 'express';
export declare class ProjectController {
    static getProjects(req: Request, res: Response): Promise<void>;
    static getProjectById(req: Request, res: Response): Promise<void>;
    static createProject(req: Request, res: Response): Promise<void>;
    static updateProject(req: Request, res: Response): Promise<void>;
    static deleteProject(req: Request, res: Response): Promise<void>;
    static updateProjectStatus(req: Request, res: Response): Promise<void>;
    static updateSettlementStatus(req: Request, res: Response): Promise<void>;
    static getProjectStats(req: Request, res: Response): Promise<void>;
    static getProjectLogs(req: Request, res: Response): Promise<void>;
}
export default ProjectController;
//# sourceMappingURL=ProjectController.d.ts.map