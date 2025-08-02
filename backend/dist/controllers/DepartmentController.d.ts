import { Request, Response } from 'express';
export declare class DepartmentController {
    private departmentService;
    getDepartments(req: Request, res: Response): Promise<void>;
    getDepartmentById(req: Request, res: Response): Promise<void>;
    createDepartment(req: Request, res: Response): Promise<void>;
    updateDepartment(req: Request, res: Response): Promise<void>;
    deleteDepartment(req: Request, res: Response): Promise<void>;
    getParentDepartmentOptions(req: Request, res: Response): Promise<void>;
    toggleDepartmentStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DepartmentController.d.ts.map