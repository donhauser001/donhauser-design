"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const ProjectService_1 = __importDefault(require("../services/ProjectService"));
const TaskService_1 = require("../services/TaskService");
const taskService = new TaskService_1.TaskService();
class ProjectController {
    static async getProjects(req, res) {
        try {
            const { page, limit, search, progressStatus, settlementStatus, undertakingTeam, clientId, excludeStatus } = req.query;
            const result = await ProjectService_1.default.getProjects({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                search: search,
                progressStatus: progressStatus,
                settlementStatus: settlementStatus,
                undertakingTeam: undertakingTeam,
                clientId: clientId,
                excludeStatus: excludeStatus
            });
            res.json({
                success: true,
                data: result.projects,
                total: result.total,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 50
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
    static async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await ProjectService_1.default.getProjectById(id);
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
                return;
            }
            const tasks = await taskService.getTasksByProject(id);
            res.json({
                success: true,
                data: {
                    ...project,
                    tasks
                }
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
    static async createProject(req, res) {
        try {
            const { project: projectData, services: servicesData } = req.body;
            const createdBy = req.user?.id || 'system';
            const project = await ProjectService_1.default.createProject({
                ...projectData,
                createdBy
            });
            if (servicesData && servicesData.length > 0) {
                const tasks = await Promise.all(servicesData.map(async (service) => {
                    return await taskService.createTask({
                        taskName: service.serviceName,
                        projectId: project._id?.toString() || '',
                        serviceId: service.serviceId,
                        quantity: service.quantity,
                        unit: service.unit,
                        subtotal: service.subtotal,
                        pricingPolicies: service.pricingPolicies?.map((policyId) => ({
                            policyId,
                            policyName: service.pricingPolicyNames || '未知政策',
                            policyType: 'uniform_discount',
                            discountRatio: 100,
                            calculationDetails: '标准定价'
                        })) || [],
                        billingDescription: `${service.serviceName} - ${service.quantity}${service.unit}`,
                        status: 'pending',
                        priority: 'medium',
                        assignedDesigners: projectData.mainDesigners || [],
                        settlementStatus: 'unpaid',
                        progress: 0
                    });
                }));
                res.status(201).json({
                    success: true,
                    message: '项目创建成功',
                    data: {
                        project,
                        tasks
                    }
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    message: '项目创建成功',
                    data: {
                        project,
                        tasks: []
                    }
                });
            }
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
    static async updateProject(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedBy = req.user?.id || 'system';
            const project = await ProjectService_1.default.updateProject(id, {
                ...updateData,
                updatedBy
            });
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '项目更新成功',
                data: project
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
    static async deleteProject(req, res) {
        try {
            const { id } = req.params;
            const deletedBy = req.user?.id || 'system';
            await ProjectService_1.default.deleteProject(id, deletedBy);
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
    static async updateProjectStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedBy = req.user?.id || 'system';
            const project = await ProjectService_1.default.updateProjectStatus(id, status, updatedBy);
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '项目状态更新成功',
                data: project
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
    static async updateSettlementStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedBy = req.user?.id || 'system';
            const project = await ProjectService_1.default.updateSettlementStatus(id, status, updatedBy);
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: '项目不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '结算状态更新成功',
                data: project
            });
        }
        catch (error) {
            console.error('更新结算状态失败:', error);
            res.status(500).json({
                success: false,
                message: '更新结算状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async getProjectStats(req, res) {
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
    static async getProjectLogs(req, res) {
        try {
            const { id } = req.params;
            const { page, limit } = req.query;
            const result = await ProjectService_1.default.getProjectLogs(id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
            res.json({
                success: true,
                data: result.logs,
                total: result.total,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 20
            });
        }
        catch (error) {
            console.error('获取项目日志失败:', error);
            res.status(500).json({
                success: false,
                message: '获取项目日志失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.ProjectController = ProjectController;
exports.default = ProjectController;
//# sourceMappingURL=ProjectController.js.map