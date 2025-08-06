"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService();
    }
    async getUsers(req, res) {
        try {
            const query = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                search: req.query.search,
                role: req.query.role,
                status: req.query.status,
                department: req.query.department
            };
            const result = await this.userService.getUsers(query);
            res.json({
                success: true,
                message: '获取用户列表成功',
                data: result.users,
                total: result.total,
                page: query.page,
                limit: query.limit
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取用户列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '获取用户信息成功',
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取用户信息失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createUser(req, res) {
        try {
            const userData = req.body;
            if (!userData.username || !userData.password || !userData.realName) {
                res.status(400).json({
                    success: false,
                    message: '用户名、密码和真实姓名为必填字段'
                });
                return;
            }
            const newUser = await this.userService.createUser(userData);
            res.status(201).json({
                success: true,
                message: '用户创建成功',
                data: newUser
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '用户创建失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await this.userService.updateUser(id, userData);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '用户信息更新成功',
                data: updatedUser
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '用户信息更新失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const success = await this.userService.deleteUser(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '用户删除成功'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '用户删除失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const { id } = req.params;
            const passwordData = req.body;
            if (!passwordData.newPassword) {
                res.status(400).json({
                    success: false,
                    message: '新密码不能为空'
                });
                return;
            }
            const success = await this.userService.resetPassword(id, passwordData);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '密码重置成功'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '密码重置失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateUserPermissions(req, res) {
        try {
            const { id } = req.params;
            const permissionData = req.body;
            const updatedUser = await this.userService.updateUserPermissions(id, permissionData);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '用户权限更新成功',
                data: updatedUser
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '用户权限更新失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.toggleUserStatus(id);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '用户状态更新成功',
                data: updatedUser
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '用户状态更新失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.json({
                success: true,
                message: '获取所有用户成功',
                data: users
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取所有用户失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async checkUsernameExists(req, res) {
        try {
            const { username } = req.params;
            const exists = await this.userService.isUsernameExists(username);
            res.json({
                success: true,
                message: '检查用户名成功',
                data: { exists }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '检查用户名失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async checkEmailExists(req, res) {
        try {
            const { email } = req.params;
            const user = await this.userService.getUserByEmail(email);
            res.json({
                success: true,
                message: '检查邮箱成功',
                data: {
                    exists: !!user,
                    userId: user?._id?.toString() || null
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '检查邮箱失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map