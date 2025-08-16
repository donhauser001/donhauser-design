"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const ProjectLog_1 = __importDefault(require("../models/ProjectLog"));
const TaskService_1 = require("./TaskService");
const UserService_1 = require("./UserService");
const EnterpriseService_1 = require("./EnterpriseService");
class ProjectService {
    constructor() {
        this.taskService = new TaskService_1.TaskService();
        this.userService = new UserService_1.UserService();
        this.enterpriseService = new EnterpriseService_1.EnterpriseService();
    }
    async getProjects(params) {
        const { page = 1, limit = 50, search, progressStatus, settlementStatus, undertakingTeam, clientId, excludeStatus } = params;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { projectName: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } }
            ];
        }
        if (progressStatus)
            filter.progressStatus = progressStatus;
        if (settlementStatus)
            filter.settlementStatus = settlementStatus;
        if (undertakingTeam)
            filter.undertakingTeam = undertakingTeam;
        if (clientId)
            filter.clientId = clientId;
        if (excludeStatus)
            filter.progressStatus = { $ne: excludeStatus };
        const [projects, total] = await Promise.all([
            Project_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Project_1.default.countDocuments(filter)
        ]);
        const projectsWithTeamNames = await Promise.all(projects.map(async (project) => {
            let undertakingTeamName = project.undertakingTeam;
            if (project.undertakingTeam) {
                try {
                    const enterprise = await this.enterpriseService.getEnterpriseById(project.undertakingTeam);
                    if (enterprise) {
                        undertakingTeamName = enterprise.enterpriseAlias || enterprise.enterpriseName;
                    }
                }
                catch (error) {
                    console.error('获取企业信息失败:', error);
                }
            }
            return {
                ...project,
                undertakingTeamName
            };
        }));
        return { projects: projectsWithTeamNames, total };
    }
    async getProjectById(id) {
        const project = await Project_1.default.findById(id).lean();
        if (!project) {
            return null;
        }
        let undertakingTeamName = project.undertakingTeam;
        if (project.undertakingTeam) {
            try {
                const enterprise = await this.enterpriseService.getEnterpriseById(project.undertakingTeam);
                if (enterprise) {
                    undertakingTeamName = enterprise.enterpriseAlias || enterprise.enterpriseName;
                }
            }
            catch (error) {
                console.error('获取企业信息失败:', error);
            }
        }
        let mainDesignerNames = [];
        if (project.mainDesigners && project.mainDesigners.length > 0) {
            try {
                const designerPromises = project.mainDesigners.map(async (designerId) => {
                    const user = await this.userService.getUserById(designerId);
                    return user ? user.realName || user.username : designerId;
                });
                mainDesignerNames = await Promise.all(designerPromises);
            }
            catch (error) {
                console.error('获取主创设计师信息失败:', error);
                mainDesignerNames = project.mainDesigners;
            }
        }
        let assistantDesignerNames = [];
        if (project.assistantDesigners && project.assistantDesigners.length > 0) {
            try {
                const designerPromises = project.assistantDesigners.map(async (designerId) => {
                    const user = await this.userService.getUserById(designerId);
                    return user ? user.realName || user.username : designerId;
                });
                assistantDesignerNames = await Promise.all(designerPromises);
            }
            catch (error) {
                console.error('获取助理设计师信息失败:', error);
                assistantDesignerNames = project.assistantDesigners;
            }
        }
        return {
            ...project,
            undertakingTeamName,
            mainDesignerNames,
            assistantDesignerNames
        };
    }
    async createProject(projectData) {
        const { tasks, createdBy, ...projectBasicData } = projectData;
        const project = new Project_1.default({
            ...projectBasicData,
            taskIds: [],
            fileIds: [],
            contractIds: [],
            invoiceIds: [],
            proposalIds: [],
            logIds: []
        });
        const savedProject = await project.save();
        await this.createProjectLog({
            projectId: savedProject._id.toString(),
            type: 'system',
            title: '项目创建',
            content: `项目 "${projectData.projectName}" 已创建`,
            createdBy
        });
        if (tasks && tasks.length > 0) {
            const tasksData = tasks.map(task => ({
                ...task,
                projectId: savedProject._id.toString(),
                status: 'pending',
                progress: 0,
                settlementStatus: 'unpaid',
                attachmentIds: [],
                pricingPolicies: task.pricingPolicies || []
            }));
            const createdTasks = await this.taskService.createTasks(tasksData);
            const taskIds = createdTasks.map((task) => task._id.toString());
            await Project_1.default.findByIdAndUpdate(savedProject._id, { taskIds });
            await this.createProjectLog({
                projectId: savedProject._id.toString(),
                type: 'task_update',
                title: '任务创建',
                content: `创建了 ${tasks.length} 个任务`,
                createdBy,
                details: { relatedIds: taskIds }
            });
            return await Project_1.default.findById(savedProject._id).lean();
        }
        return savedProject;
    }
    async updateProject(id, updateData) {
        const { updatedBy, ...updateFields } = updateData;
        const project = await Project_1.default.findById(id);
        if (!project) {
            return null;
        }
        if (updateFields.progressStatus && updateFields.progressStatus !== project.progressStatus) {
            await this.createProjectLog({
                projectId: id,
                type: 'status_change',
                title: '进度状态变更',
                content: `项目进度状态从 "${project.progressStatus}" 变更为 "${updateFields.progressStatus}"`,
                createdBy: updatedBy,
                details: {
                    oldValue: project.progressStatus,
                    newValue: updateFields.progressStatus
                }
            });
        }
        if (updateFields.settlementStatus && updateFields.settlementStatus !== project.settlementStatus) {
            await this.createProjectLog({
                projectId: id,
                type: 'settlement',
                title: '结算状态变更',
                content: `项目结算状态从 "${project.settlementStatus}" 变更为 "${updateFields.settlementStatus}"`,
                createdBy: updatedBy,
                details: {
                    oldValue: project.settlementStatus,
                    newValue: updateFields.settlementStatus
                }
            });
        }
        if (updateFields.mainDesigners || updateFields.assistantDesigners) {
            await this.createProjectLog({
                projectId: id,
                type: 'team_change',
                title: '团队变更',
                content: '项目团队人员已更新',
                createdBy: updatedBy,
                details: {
                    oldValue: {
                        mainDesigners: project.mainDesigners,
                        assistantDesigners: project.assistantDesigners
                    },
                    newValue: {
                        mainDesigners: updateFields.mainDesigners || project.mainDesigners,
                        assistantDesigners: updateFields.assistantDesigners || project.assistantDesigners
                    }
                }
            });
        }
        return await Project_1.default.findByIdAndUpdate(id, updateFields, { new: true });
    }
    async deleteProject(id, deletedBy) {
        const project = await Project_1.default.findById(id);
        if (!project) {
            throw new Error('项目不存在');
        }
        await this.taskService.deleteTasksByProject(id);
        await this.createProjectLog({
            projectId: id,
            type: 'system',
            title: '项目删除',
            content: `项目 "${project.projectName}" 已被删除`,
            createdBy: deletedBy
        });
        await Project_1.default.findByIdAndDelete(id);
    }
    async updateProjectStatus(id, status, updatedBy) {
        return await this.updateProject(id, { progressStatus: status, updatedBy });
    }
    async updateSettlementStatus(id, status, updatedBy) {
        const updateData = { settlementStatus: status, updatedBy };
        if (status === 'fully-paid') {
            updateData.settledAt = new Date();
        }
        return await this.updateProject(id, updateData);
    }
    async getProjectStats() {
        const [total, consulting, inProgress, partialDelivery, completed, onHold, cancelled, unpaid, prepaid, partialPaid, fullyPaid] = await Promise.all([
            Project_1.default.countDocuments(),
            Project_1.default.countDocuments({ progressStatus: 'consulting' }),
            Project_1.default.countDocuments({ progressStatus: 'in-progress' }),
            Project_1.default.countDocuments({ progressStatus: 'partial-delivery' }),
            Project_1.default.countDocuments({ progressStatus: 'completed' }),
            Project_1.default.countDocuments({ progressStatus: 'on-hold' }),
            Project_1.default.countDocuments({ progressStatus: 'cancelled' }),
            Project_1.default.countDocuments({ settlementStatus: 'unpaid' }),
            Project_1.default.countDocuments({ settlementStatus: 'prepaid' }),
            Project_1.default.countDocuments({ settlementStatus: 'partial-paid' }),
            Project_1.default.countDocuments({ settlementStatus: 'fully-paid' })
        ]);
        return {
            total,
            consulting,
            inProgress,
            partialDelivery,
            completed,
            onHold,
            cancelled,
            unpaid,
            prepaid,
            partialPaid,
            fullyPaid
        };
    }
    async createProjectLog(logData) {
        const log = new ProjectLog_1.default(logData);
        await log.save();
        await Project_1.default.findByIdAndUpdate(logData.projectId, { $push: { logIds: log._id.toString() } });
    }
    async getProjectLogs(projectId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            ProjectLog_1.default.find({ projectId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ProjectLog_1.default.countDocuments({ projectId })
        ]);
        return { logs, total };
    }
}
exports.ProjectService = ProjectService;
exports.default = new ProjectService();
//# sourceMappingURL=ProjectService.js.map