"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const TaskService_1 = require("../services/TaskService");
const taskService = new TaskService_1.TaskService();
class TaskController {
    static async getTasks(req, res) {
        try {
            const { page, limit, projectId, designerId, status, priority, settlementStatus, search } = req.query;
            const result = await taskService.getTasks({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                projectId: projectId,
                designerId: designerId,
                status: status,
                priority: priority,
                settlementStatus: settlementStatus,
                search: search
            });
            res.json({
                success: true,
                data: result.tasks,
                total: result.total,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20
            });
        }
        catch (error) {
            console.error('获取任务列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取任务列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async getTaskById(req, res) {
        try {
            const { id } = req.params;
            const task = await taskService.getTaskById(id);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }
            res.json({
                success: true,
                data: task
            });
        }
        catch (error) {
            console.error('获取任务详情失败:', error);
            res.status(500).json({
                success: false,
                message: '获取任务详情失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async getTasksByProject(req, res) {
        try {
            const { projectId } = req.params;
            const tasks = await taskService.getTasksByProject(projectId);
            res.json({
                success: true,
                data: tasks
            });
        }
        catch (error) {
            console.error('获取项目任务失败:', error);
            res.status(500).json({
                success: false,
                message: '获取项目任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async getTasksByDesigner(req, res) {
        try {
            const { designerId } = req.params;
            const { status } = req.query;
            const tasks = await taskService.getTasksByDesigner(designerId, status);
            res.json({
                success: true,
                data: tasks
            });
        }
        catch (error) {
            console.error('获取设计师任务失败:', error);
            res.status(500).json({
                success: false,
                message: '获取设计师任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async createTask(req, res) {
        try {
            const taskData = req.body;
            const task = await taskService.createTask(taskData);
            res.status(201).json({
                success: true,
                message: '任务创建成功',
                data: task
            });
        }
        catch (error) {
            console.error('创建任务失败:', error);
            res.status(500).json({
                success: false,
                message: '创建任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async createTasks(req, res) {
        try {
            const { tasks } = req.body;
            if (!Array.isArray(tasks)) {
                return res.status(400).json({
                    success: false,
                    message: '任务数据必须是数组'
                });
            }
            const createdTasks = await taskService.createTasks(tasks);
            res.status(201).json({
                success: true,
                message: `成功创建 ${createdTasks.length} 个任务`,
                data: createdTasks
            });
        }
        catch (error) {
            console.error('批量创建任务失败:', error);
            res.status(500).json({
                success: false,
                message: '批量创建任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async updateTask(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedBy = req.user?.id || 'system';
            const task = await taskService.updateTask(id, updateData, updatedBy);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }
            res.json({
                success: true,
                message: '任务更新成功',
                data: task
            });
        }
        catch (error) {
            console.error('更新任务失败:', error);
            res.status(500).json({
                success: false,
                message: '更新任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, progress } = req.body;
            const updatedBy = req.user?.id || 'system';
            const task = await taskService.updateTaskStatus(id, status, updatedBy, progress);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }
            res.json({
                success: true,
                message: '任务状态更新成功',
                data: task
            });
        }
        catch (error) {
            console.error('更新任务状态失败:', error);
            res.status(500).json({
                success: false,
                message: '更新任务状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async updateTaskSettlementStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedBy = req.user?.id || 'system';
            const task = await taskService.updateTaskSettlementStatus(id, status, updatedBy);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }
            res.json({
                success: true,
                message: '任务结算状态更新成功',
                data: task
            });
        }
        catch (error) {
            console.error('更新任务结算状态失败:', error);
            res.status(500).json({
                success: false,
                message: '更新任务结算状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async assignDesigners(req, res) {
        try {
            const { id } = req.params;
            const { designerIds } = req.body;
            const updatedBy = req.user?.id || 'system';
            if (!Array.isArray(designerIds)) {
                return res.status(400).json({
                    success: false,
                    message: '设计师ID必须是数组'
                });
            }
            const task = await taskService.assignDesigners(id, designerIds, updatedBy);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }
            res.json({
                success: true,
                message: '设计师分配成功',
                data: task
            });
        }
        catch (error) {
            console.error('分配设计师失败:', error);
            res.status(500).json({
                success: false,
                message: '分配设计师失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const deletedBy = req.user?.id || 'system';
            const success = await taskService.deleteTask(id, deletedBy);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }
            res.json({
                success: true,
                message: '任务删除成功'
            });
        }
        catch (error) {
            console.error('删除任务失败:', error);
            res.status(500).json({
                success: false,
                message: '删除任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async getTaskStats(req, res) {
        try {
            const { projectId, designerId } = req.query;
            const stats = await taskService.getTaskStats(projectId, designerId);
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('获取任务统计失败:', error);
            res.status(500).json({
                success: false,
                message: '获取任务统计失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.TaskController = TaskController;
exports.default = TaskController;
//# sourceMappingURL=TaskController.js.map