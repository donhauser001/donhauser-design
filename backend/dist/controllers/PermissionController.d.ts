import { Request, Response } from 'express';
export declare class PermissionController {
    private permissionService;
    getPermissionTree(req: Request, res: Response): Promise<void>;
    getPermissionGroups(req: Request, res: Response): Promise<void>;
    getPermissionGroupById(req: Request, res: Response): Promise<void>;
    createPermissionGroup(req: Request, res: Response): Promise<void>;
    updatePermissionGroup(req: Request, res: Response): Promise<void>;
    deletePermissionGroup(req: Request, res: Response): Promise<void>;
    getAllPermissions(req: Request, res: Response): Promise<void>;
    validatePermissions(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PermissionController.d.ts.map