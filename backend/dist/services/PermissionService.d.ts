import { Permission, PermissionGroup, CreatePermissionGroupRequest, UpdatePermissionGroupRequest, PermissionGroupQuery } from '../models/Permission';
export declare class PermissionService {
    getPermissionTree(): Promise<Permission[]>;
    getPermissionGroups(query?: PermissionGroupQuery): Promise<{
        permissionGroups: PermissionGroup[];
        total: number;
    }>;
    getPermissionGroupById(id: string): Promise<PermissionGroup | null>;
    createPermissionGroup(groupData: CreatePermissionGroupRequest): Promise<PermissionGroup>;
    updatePermissionGroup(id: string, groupData: UpdatePermissionGroupRequest): Promise<PermissionGroup | null>;
    deletePermissionGroup(id: string): Promise<boolean>;
    getAllPermissions(): string[];
    validatePermissions(permissions: string[]): {
        valid: string[];
        invalid: string[];
    };
}
//# sourceMappingURL=PermissionService.d.ts.map