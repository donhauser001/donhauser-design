"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const TaskService_1 = require("../services/TaskService");
class TaskController {
    constructor() {
        this.createTask = async (req, res) => {
            try {
                const task = await this.taskService.createTask(req.body);
                res.status(201).json({
                    success: true,
                    data: task,
                    message: '任务创建成功'
                });
            }
            catch (error) {
                console.error('创建任务失败:', error);
                let errorMessage = '创建任务失败';
                let statusCode = 500;
                if (error.name === 'ValidationError') {
                    statusCode = 400;
                    const validationErrors = Object.values(error.errors).map((err) => err.message);
                    errorMessage = `数据验证失败: ${validationErrors.join(', ')}`;
                }
                else if (error.name === 'CastError') {
                    statusCode = 400;
                    errorMessage = `数据类型错误: ${error.message}`;
                }
                else if (error.code === 11000) {
                    statusCode = 409;
                    errorMessage = '任务已存在，请检查任务名称';
                }
                else if (error.message) {
                    errorMessage = error.message;
                }
                res.status(statusCode).json({
                    success: false,
                    message: errorMessage,
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };
        this.createTasks = async (req, res) => {
            try {
                const { tasks } = req.body;
                if (!Array.isArray(tasks)) {
                    return res.status(400).json({
                        success: false,
                        message: '任务数据格式错误'
                    });
                }
                const createdTasks = await this.taskService.createTasks(tasks);
                res.status(201).json({
                    success: true,
                    data: createdTasks,
                    message: `成功创建 ${createdTasks.length} 个任务`
                });
            }
            catch (error) {
                console.error('批量创建任务失败:', error);
                res.status(500).json({
                    success: false,
                    message: '批量创建任务失败'
                });
            }
        };
        this.getTasks = async (req, res) => {
            try {
                const { page, limit, projectId, designerId, status, priority, search } = req.query;
                const result = await this.taskService.getTasks({
                    page: page ? parseInt(page) : 1,
                    limit: limit ? parseInt(limit) : 20,
                    projectId: projectId,
                    designerId: designerId,
                    status: status,
                    priority: priority,
                    search: search
                });
                res.json({
                    success: true,
                    data: result.tasks,
                    pagination: {
                        page: page ? parseInt(page) : 1,
                        limit: limit ? parseInt(limit) : 20,
                        total: result.total,
                        pages: Math.ceil(result.total / (limit ? parseInt(limit) : 20))
                    }
                });
            }
            catch (error) {
                console.error('获取任务列表失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取任务列表失败'
                });
            }
        };
        this.getTaskById = async (req, res) => {
            try {
                const { id } = req.params;
                const task = await this.taskService.getTaskById(id);
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
                    message: '获取任务详情失败'
                });
            }
        };
        this.getTasksByProject = async (req, res) => {
            try {
                const { projectId } = req.params;
                const tasks = await this.taskService.getTasksByProject(projectId);
                res.json({
                    success: true,
                    data: tasks
                });
            }
            catch (error) {
                console.error('获取项目任务失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取项目任务失败'
                });
            }
        };
        this.getTasksByDesigner = async (req, res) => {
            try {
                const { designerId } = req.params;
                const { status } = req.query;
                const tasks = await this.taskService.getTasksByDesigner(designerId, status);
                res.json({
                    success: true,
                    data: tasks
                });
            }
            catch (error) {
                console.error('获取设计师任务失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取设计师任务失败'
                });
            }
        };
        this.updateTask = async (req, res) => {
            try {
                const { id } = req.params;
                const task = await this.taskService.updateTask(id, req.body);
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        message: '任务不存在'
                    });
                }
                res.json({
                    success: true,
                    data: task,
                    message: '任务更新成功'
                });
            }
            catch (error) {
                console.error('更新任务失败:', error);
                res.status(500).json({
                    success: false,
                    message: '更新任务失败'
                });
            }
        };
        this.updateTaskStatus = async (req, res) => {
            try {
                const { id } = req.params;
                const { status, progress } = req.body;
                const task = await this.taskService.updateTaskStatus(id, status, progress);
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        message: '任务不存在'
                    });
                }
                res.json({
                    success: true,
                    data: task,
                    message: '任务状态更新成功'
                });
            }
            catch (error) {
                console.error('更新任务状态失败:', error);
                res.status(500).json({
                    success: false,
                    message: '更新任务状态失败'
                });
            }
        };
        this.assignDesigners = async (req, res) => {
            try {
                const { id } = req.params;
                const { designerIds } = req.body;
                if (!Array.isArray(designerIds)) {
                    return res.status(400).json({
                        success: false,
                        message: '设计师ID格式错误'
                    });
                }
                const task = await this.taskService.assignDesigners(id, designerIds);
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        message: '任务不存在'
                    });
                }
                res.json({
                    success: true,
                    data: task,
                    message: '设计师分配成功'
                });
            }
            catch (error) {
                console.error('分配设计师失败:', error);
                res.status(500).json({
                    success: false,
                    message: '分配设计师失败'
                });
            }
        };
        this.deleteTask = async (req, res) => {
            try {
                const { id } = req.params;
                const success = await this.taskService.deleteTask(id);
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
                    message: '删除任务失败'
                });
            }
        };
        this.getTaskStats = async (req, res) => {
            try {
                const { projectId, designerId } = req.query;
                const stats = await this.taskService.getTaskStats(projectId, designerId);
                res.json({
                    success: true,
                    data: stats
                });
            }
            catch (error) {
                console.error('获取任务统计失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取任务统计失败'
                });
            }
        };
        this.taskService = new TaskService_1.TaskService();
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map