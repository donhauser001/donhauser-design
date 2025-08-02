import { Request, Response } from 'express';
export declare class RoleController {
    static getRoles(req: Request, res: Response): Promise<void>;
    static getRoleById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAllRoles(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=RoleController.d.ts.map