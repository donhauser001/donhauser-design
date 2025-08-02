"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const RoleService_1 = require("../services/RoleService");
class RoleController {
    static async getRoles(req, res) {
        try {
            const query = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                status: req.query.status
            };
            const result = RoleService_1.RoleService.getRoles(query);
            res.json({
                success: true,
                data: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit
            });
        }
        catch (error) {
            console.error('获取角色列表失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误'
            });
        }
    }
    static async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const role = RoleService_1.RoleService.getRoleById(id);
            if (!role) {
                return res.status(404).json({
                    success: false,
                    error: '角色不存在'
                });
            }
            res.json({
                success: true,
                data: role
            });
        }
        catch (error) {
            console.error('获取角色详情失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误'
            });
        }
    }
    static async createRole(req, res) {
        try {
            const roleData = req.body;
            if (!roleData.roleName || !roleData.description) {
                return res.status(400).json({
                    success: false,
                    error: '角色名称和描述不能为空'
                });
            }
            if (RoleService_1.RoleService.isRoleNameExists(roleData.roleName)) {
                return res.status(400).json({
                    success: false,
                    error: '角色名称已存在'
                });
            }
            const newRole = RoleService_1.RoleService.createRole(roleData);
            res.status(201).json({
                success: true,
                data: newRole,
                message: '角色创建成功'
            });
        }
        catch (error) {
            console.error('创建角色失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误'
            });
        }
    }
    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const roleData = req.body;
            const existingRole = RoleService_1.RoleService.getRoleById(id);
            if (!existingRole) {
                return res.status(404).json({
                    success: false,
                    error: '角色不存在'
                });
            }
            if (roleData.roleName && roleData.roleName !== existingRole.roleName) {
                if (RoleService_1.RoleService.isRoleNameExists(roleData.roleName, id)) {
                    return res.status(400).json({
                        success: false,
                        error: '角色名称已存在'
                    });
                }
            }
            const updatedRole = RoleService_1.RoleService.updateRole(id, roleData);
            if (!updatedRole) {
                return res.status(404).json({
                    success: false,
                    error: '角色不存在'
                });
            }
            res.json({
                success: true,
                data: updatedRole,
                message: '角色更新成功'
            });
        }
        catch (error) {
            console.error('更新角色失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误'
            });
        }
    }
    static async deleteRole(req, res) {
        try {
            const { id } = req.params;
            const existingRole = RoleService_1.RoleService.getRoleById(id);
            if (!existingRole) {
                return res.status(404).json({
                    success: false,
                    error: '角色不存在'
                });
            }
            if (existingRole.userCount > 0) {
                return res.status(400).json({
                    success: false,
                    error: '该角色正在被用户使用，无法删除'
                });
            }
            const success = RoleService_1.RoleService.deleteRole(id);
            if (!success) {
                return res.status(400).json({
                    success: false,
                    error: '删除角色失败'
                });
            }
            res.json({
                success: true,
                message: '角色删除成功'
            });
        }
        catch (error) {
            console.error('删除角色失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误'
            });
        }
    }
    static async getAllRoles(req, res) {
        try {
            const roles = RoleService_1.RoleService.getAllRoles();
            res.json({
                success: true,
                data: roles
            });
        }
        catch (error) {
            console.error('获取所有角色失败:', error);
            res.status(500).json({
                success: false,
                error: '服务器内部错误'
            });
        }
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=RoleController.js.map