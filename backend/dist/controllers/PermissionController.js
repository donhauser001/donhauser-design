"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const PermissionService_1 = require("../services/PermissionService");
class PermissionController {
    constructor() {
        this.permissionService = new PermissionService_1.PermissionService();
    }
    async getPermissionTree(req, res) {
        try {
            const treeData = await this.permissionService.getPermissionTree();
            res.json({
                success: true,
                data: treeData
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取权限树失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getPermissionGroups(req, res) {
        try {
            const query = {
                search: req.query.search,
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined
            };
            const result = await this.permissionService.getPermissionGroups(query);
            res.json({
                success: true,
                data: result.permissionGroups,
                total: result.total,
                page: query.page || 1,
                limit: query.limit || 10
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取权限组列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getPermissionGroupById(req, res) {
        try {
            const { id } = req.params;
            const permissionGroup = await this.permissionService.getPermissionGroupById(id);
            if (!permissionGroup) {
                res.status(404).json({
                    success: false,
                    message: '权限组不存在'
                });
                return;
            }
            res.json({
                success: true,
                data: permissionGroup
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取权限组信息失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createPermissionGroup(req, res) {
        try {
            const groupData = req.body;
            const { valid, invalid } = this.permissionService.validatePermissions(groupData.permissions);
            if (invalid.length > 0) {
                res.status(400).json({
                    success: false,
                    message: '存在无效的权限',
                    data: { invalid }
                });
                return;
            }
            const newPermissionGroup = await this.permissionService.createPermissionGroup({
                ...groupData,
                permissions: valid
            });
            res.status(201).json({
                success: true,
                message: '权限组创建成功',
                data: newPermissionGroup
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '权限组创建失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updatePermissionGroup(req, res) {
        try {
            const { id } = req.params;
            const groupData = req.body;
            if (groupData.permissions) {
                const { valid, invalid } = this.permissionService.validatePermissions(groupData.permissions);
                if (invalid.length > 0) {
                    res.status(400).json({
                        success: false,
                        message: '存在无效的权限',
                        data: { invalid }
                    });
                    return;
                }
                groupData.permissions = valid;
            }
            const updatedPermissionGroup = await this.permissionService.updatePermissionGroup(id, groupData);
            if (!updatedPermissionGroup) {
                res.status(404).json({
                    success: false,
                    message: '权限组不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '权限组信息更新成功',
                data: updatedPermissionGroup
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '权限组信息更新失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deletePermissionGroup(req, res) {
        try {
            const { id } = req.params;
            const permissionGroup = await this.permissionService.getPermissionGroupById(id);
            if (permissionGroup && permissionGroup.name === '超级管理员权限组') {
                res.status(400).json({
                    success: false,
                    message: '超级管理员权限组不能删除'
                });
                return;
            }
            const success = await this.permissionService.deletePermissionGroup(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '权限组不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '权限组删除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '权限组删除失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getAllPermissions(req, res) {
        try {
            const permissions = this.permissionService.getAllPermissions();
            res.json({
                success: true,
                data: permissions
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取权限列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async validatePermissions(req, res) {
        try {
            const { permissions } = req.body;
            if (!Array.isArray(permissions)) {
                res.status(400).json({
                    success: false,
                    message: '权限参数必须是数组'
                });
                return;
            }
            const { valid, invalid } = this.permissionService.validatePermissions(permissions);
            res.json({
                success: true,
                data: { valid, invalid }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '权限验证失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=PermissionController.js.map