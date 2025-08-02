import { Role, CreateRoleRequest, UpdateRoleRequest, RoleQuery } from '../models/Role';
export declare class RoleService {
    static getRoles(query?: RoleQuery): {
        data: Role[];
        total: number;
        page: number;
        limit: number;
    };
    static getRoleById(id: string): Role | null;
    static createRole(roleData: CreateRoleRequest): Role;
    static updateRole(id: string, roleData: UpdateRoleRequest): Role | null;
    static deleteRole(id: string): boolean;
    static isRoleNameExists(roleName: string, excludeId?: string): boolean;
    static getAllRoles(): Role[];
}
//# sourceMappingURL=RoleService.d.ts.map