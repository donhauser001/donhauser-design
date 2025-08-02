"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
let roles = [
    {
        id: '1',
        roleName: '超级管理员',
        description: '拥有系统所有权限，可以管理所有功能和用户',
        permissions: ['all'],
        permissionGroups: [],
        status: 'active',
        userCount: 1,
        createTime: '2024-01-01 10:00:00'
    },
    {
        id: '2',
        roleName: '客户',
        description: '客户角色，可以查看自己的项目进度和文件',
        permissions: ['projects:view', 'clients:view', 'contracts:view', 'file-center:view', 'file-center:download'],
        permissionGroups: [],
        status: 'active',
        userCount: 0,
        createTime: '2024-01-02 14:30:00'
    },
    {
        id: '3',
        roleName: '员工',
        description: '普通员工角色，可以参与项目工作和查看相关信息',
        permissions: ['dashboard:view', 'projects:view', 'projects:edit', 'clients:view', 'file-center:view', 'file-center:upload', 'file-center:download'],
        permissionGroups: [],
        status: 'active',
        userCount: 0,
        createTime: '2024-01-03 09:15:00'
    }
];
class RoleService {
    static getRoles(query = {}) {
        const { page = 1, limit = 10, search = '', status } = query;
        let filteredRoles = roles;
        if (search) {
            filteredRoles = filteredRoles.filter(role => role.roleName.toLowerCase().includes(search.toLowerCase()) ||
                role.description.toLowerCase().includes(search.toLowerCase()));
        }
        if (status) {
            filteredRoles = filteredRoles.filter(role => role.status === status);
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
        return {
            data: paginatedRoles,
            total: filteredRoles.length,
            page,
            limit
        };
    }
    static getRoleById(id) {
        return roles.find(role => role.id === id) || null;
    }
    static createRole(roleData) {
        const newRole = {
            id: Date.now().toString(),
            ...roleData,
            userCount: 0,
            createTime: new Date().toLocaleString()
        };
        roles.push(newRole);
        return newRole;
    }
    static updateRole(id, roleData) {
        const roleIndex = roles.findIndex(role => role.id === id);
        if (roleIndex === -1) {
            return null;
        }
        roles[roleIndex] = {
            ...roles[roleIndex],
            ...roleData
        };
        return roles[roleIndex];
    }
    static deleteRole(id) {
        const roleIndex = roles.findIndex(role => role.id === id);
        if (roleIndex === -1) {
            return false;
        }
        if (roles[roleIndex].userCount > 0) {
            return false;
        }
        roles.splice(roleIndex, 1);
        return true;
    }
    static isRoleNameExists(roleName, excludeId) {
        return roles.some(role => role.roleName === roleName &&
            (!excludeId || role.id !== excludeId));
    }
    static getAllRoles() {
        return roles;
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=RoleService.js.map