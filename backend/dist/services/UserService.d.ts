import { CreateUserRequest, UpdateUserRequest, UserQuery, ResetPasswordRequest, UpdateUserPermissionsRequest } from '../models/User';
export declare class UserService {
    getUsers(query?: UserQuery): Promise<{
        users: any[];
        total: number;
    }>;
    getUserById(id: string): Promise<any | null>;
    getUserByUsername(username: string): Promise<any | null>;
    createUser(userData: CreateUserRequest): Promise<any>;
    updateUser(id: string, userData: UpdateUserRequest): Promise<any | null>;
    deleteUser(id: string): Promise<boolean>;
    resetPassword(id: string, passwordData: ResetPasswordRequest): Promise<boolean>;
    updateUserPermissions(id: string, permissionData: UpdateUserPermissionsRequest): Promise<any | null>;
    toggleUserStatus(id: string): Promise<any | null>;
    getAllUsers(): Promise<any[]>;
    getEmployeesAndAdmins(): Promise<any[]>;
    isUsernameExists(username: string): Promise<boolean>;
    getUserByEmail(email: string): Promise<any | null>;
    isEmailExists(email: string): Promise<boolean>;
    updateLastLogin(id: string): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map