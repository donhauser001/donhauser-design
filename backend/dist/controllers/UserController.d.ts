import { Request, Response } from 'express';
export declare class UserController {
    private userService;
    getUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    updateUserPermissions(req: Request, res: Response): Promise<void>;
    toggleUserStatus(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    getEmployeesAndAdmins(req: Request, res: Response): Promise<void>;
    checkUsernameExists(req: Request, res: Response): Promise<void>;
    checkEmailExists(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map