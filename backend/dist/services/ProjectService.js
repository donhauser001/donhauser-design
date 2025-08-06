"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const TaskService_1 = require("./TaskService");
class ProjectService {
    async getProjects(params) {
        const { page = 1, limit = 50, search, status, team } = params;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { projectName: { $regex: search, $options: 'i' } },
                { client: { $regex: search, $options: 'i' } },
                { contact: { $regex: search, $options: 'i' } }
            ];
        }
        if (status)
            filter.status = status;
        if (team)
            filter.team = team;
        const [projects, total] = await Promise.all([
            Project_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Project_1.default.countDocuments(filter)
        ]);
        return { projects, total };
    }
    async getProjectById(id) {
        return await Project_1.default.findById(id).lean();
    }
    async createProject(projectData) {
        const taskService = new TaskService_1.TaskService();
        const project = new Project_1.default({
            projectName: projectData.projectName,
            client: projectData.client,
            contact: projectData.contact,
            team: projectData.team,
            mainDesigner: projectData.mainDesigner,
            assistantDesigners: projectData.assistantDesigners,
            relatedOrders: projectData.relatedOrders,
            relatedTaskIds: [],
            clientRequirements: projectData.clientRequirements,
            startDate: projectData.startDate,
            status: 'pending',
            relatedContracts: [],
            relatedSettlements: [],
            relatedInvoices: [],
            relatedFiles: [],
            relatedProposals: []
        });
        const savedProject = await project.save();
        if (projectData.relatedTasks && projectData.relatedTasks.length > 0) {
            const tasksData = projectData.relatedTasks.map(task => ({
                taskName: task.serviceName,
                serviceId: task.serviceId,
                projectId: savedProject._id.toString(),
                orderId: projectData.relatedOrders[0],
                assignedDesigners: [...projectData.mainDesigner, ...projectData.assistantDesigners],
                specification: task.specification,
                quantity: task.quantity,
                unit: task.unit,
                subtotal: task.subtotal,
                status: 'pending',
                priority: 'medium',
                progress: 0
            }));
            const createdTasks = await taskService.createTasks(tasksData);
            const taskIds = createdTasks.map(task => task._id.toString());
            await Project_1.default.findByIdAndUpdate(savedProject._id, { relatedTaskIds: taskIds });
            return await Project_1.default.findById(savedProject._id).lean();
        }
        return savedProject;
    }
    async updateProject(id, updateData) {
        return await Project_1.default.findByIdAndUpdate(id, { ...updateData, updateTime: new Date() }, { new: true });
    }
    async deleteProject(id) {
        const taskService = new TaskService_1.TaskService();
        await taskService.deleteTasksByProject(id);
        await Project_1.default.findByIdAndDelete(id);
    }
    async updateProjectStatus(id, status) {
        return await Project_1.default.findByIdAndUpdate(id, { status, updateTime: new Date() }, { new: true });
    }
    async getProjectStats() {
        const [total, pending, inProgress, completed, cancelled, onHold] = await Promise.all([
            Project_1.default.countDocuments(),
            Project_1.default.countDocuments({ status: 'pending' }),
            Project_1.default.countDocuments({ status: 'in-progress' }),
            Project_1.default.countDocuments({ status: 'completed' }),
            Project_1.default.countDocuments({ status: 'cancelled' }),
            Project_1.default.countDocuments({ status: 'on-hold' })
        ]);
        return {
            total,
            pending,
            inProgress,
            completed,
            cancelled,
            onHold
        };
    }
}
exports.ProjectService = ProjectService;
exports.default = new ProjectService();
//# sourceMappingURL=ProjectService.js.map