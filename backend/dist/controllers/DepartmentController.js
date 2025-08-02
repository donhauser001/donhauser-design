"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const DepartmentService_1 = require("../services/DepartmentService");
class DepartmentController {
    constructor() {
        this.departmentService = new DepartmentService_1.DepartmentService();
    }
    async getDepartments(req, res) {
        try {
            const query = {
                enterpriseId: req.query.enterpriseId,
                parentId: req.query.parentId,
                status: req.query.status,
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined
            };
            const result = await this.departmentService.getDepartments(query);
            res.json({
                success: true,
                data: result.departments,
                total: result.total,
                page: query.page || 1,
                limit: query.limit || 10
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取部门列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const department = await this.departmentService.getDepartmentById(id);
            if (!department) {
                res.status(404).json({
                    success: false,
                    message: '部门不存在'
                });
                return;
            }
            res.json({
                success: true,
                data: department
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取部门信息失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createDepartment(req, res) {
        try {
            const departmentData = req.body;
            const newDepartment = await this.departmentService.createDepartment(departmentData);
            res.status(201).json({
                success: true,
                message: '部门创建成功',
                data: newDepartment
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '部门创建失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateDepartment(req, res) {
        try {
            const { id } = req.params;
            const departmentData = req.body;
            const updatedDepartment = await this.departmentService.updateDepartment(id, departmentData);
            if (!updatedDepartment) {
                res.status(404).json({
                    success: false,
                    message: '部门不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '部门信息更新成功',
                data: updatedDepartment
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '部门信息更新失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deleteDepartment(req, res) {
        try {
            const { id } = req.params;
            const success = await this.departmentService.deleteDepartment(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '部门不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '部门删除成功'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '部门删除失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getParentDepartmentOptions(req, res) {
        try {
            const { enterpriseId } = req.params;
            const options = await this.departmentService.getParentDepartmentOptions(enterpriseId);
            res.json({
                success: true,
                data: options
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取上级部门选项失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async toggleDepartmentStatus(req, res) {
        try {
            const { id } = req.params;
            const updatedDepartment = await this.departmentService.toggleDepartmentStatus(id);
            if (!updatedDepartment) {
                res.status(404).json({
                    success: false,
                    message: '部门不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: `部门已${updatedDepartment.status === 'active' ? '启用' : '禁用'}`,
                data: updatedDepartment
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '切换部门状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.DepartmentController = DepartmentController;
//# sourceMappingURL=DepartmentController.js.map