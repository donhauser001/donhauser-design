"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const ProjectService_1 = __importDefault(require("../services/ProjectService"));
const TaskService_1 = require("../services/TaskService");
class ProjectController {
    async getProjects(req, res) {
        try {
            const { page = 1, limit = 50, search, status, team } = req.query;
            const result = await ProjectService_1.default.getProjects({
                page: Number(page),
                limit: Number(limit),
                search: search,
                status: status,
                team: team
            });
            res.json({
                success: true,
                data: result.projects,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: result.total,
                    pages: Math.ceil(result.total / Number(limit))
                }
            });
        }
        catch (error) {
            console.error('获取项目列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取项目列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await ProjectService_1.default.getProjectById(id);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
            }
            res.json({
                success: true,
                data: project
            });
        }
        catch (error) {
            console.error('获取项目详情失败:', error);
            res.status(500).json({
                success: false,
                message: '获取项目详情失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createProject(req, res) {
        try {
            const { projectName, client, contact, team, mainDesigner, assistantDesigners, relatedOrders, relatedTasks, clientRequirements, startDate } = req.body;
            const project = await ProjectService_1.default.createProject({
                projectName,
                client,
                contact,
                team,
                mainDesigner,
                assistantDesigners,
                relatedOrders,
                relatedTasks,
                clientRequirements,
                startDate: new Date(startDate)
            });
            res.status(201).json({
                success: true,
                data: project,
                message: '项目创建成功'
            });
        }
        catch (error) {
            console.error('创建项目失败:', error);
            res.status(500).json({
                success: false,
                message: '创建项目失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const project = await ProjectService_1.default.updateProject(id, updateData);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
            }
            res.json({
                success: true,
                data: project,
                message: '项目更新成功'
            });
        }
        catch (error) {
            console.error('更新项目失败:', error);
            res.status(500).json({
                success: false,
                message: '更新项目失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            await ProjectService_1.default.deleteProject(id);
            res.json({
                success: true,
                message: '项目删除成功'
            });
        }
        catch (error) {
            console.error('删除项目失败:', error);
            res.status(500).json({
                success: false,
                message: '删除项目失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateProjectStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const project = await ProjectService_1.default.updateProjectStatus(id, status);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
            }
            res.json({
                success: true,
                data: project,
                message: '项目状态更新成功'
            });
        }
        catch (error) {
            console.error('更新项目状态失败:', error);
            res.status(500).json({
                success: false,
                message: '更新项目状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getProjectStats(req, res) {
        try {
            const stats = await ProjectService_1.default.getProjectStats();
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('获取项目统计失败:', error);
            res.status(500).json({
                success: false,
                message: '获取项目统计失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getProjectTasks(req, res) {
        try {
            const { id } = req.params;
            const taskService = new TaskService_1.TaskService();
            const tasks = await taskService.getTasksByProject(id);
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
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map