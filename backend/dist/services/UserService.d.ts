import { User, CreateUserRequest, UpdateUserRequest, UserQuery, ResetPasswordRequest, UpdateUserPermissionsRequest } from '../models/User';
export declare class UserService {
    getUsers(query?: UserQuery): Promise<{
        users: User[];
        total: number;
    }>;
    getUserById(id: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    createUser(userData: CreateUserRequest): Promise<User>;
    updateUser(id: string, userData: UpdateUserRequest): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
    resetPassword(id: string, passwordData: ResetPasswordRequest): Promise<boolean>;
    updateUserPermissions(id: string, permissionData: UpdateUserPermissionsRequest): Promise<User | null>;
    toggleUserStatus(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    isUsernameExists(username: string): Promise<boolean>;
    isEmailExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=UserService.d.ts.map