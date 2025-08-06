"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const ProjectLog_1 = __importDefault(require("../models/ProjectLog"));
class TaskService {
    async createTask(taskData) {
        try {
            const requiredFields = ['taskName', 'serviceId', 'projectId', 'quantity', 'unit', 'subtotal', 'billingDescription'];
            const missingFields = requiredFields.filter(field => !taskData[field]);
            if (missingFields.length > 0) {
                throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
            }
            if (typeof taskData.quantity !== 'number' || taskData.quantity <= 0) {
                throw new Error('数量必须是大于0的数字');
            }
            if (typeof taskData.subtotal !== 'number' || taskData.subtotal < 0) {
                throw new Error('小计金额不能为负数');
            }
            if (typeof taskData.taskName !== 'string' || taskData.taskName.trim().length === 0) {
                throw new Error('任务名称不能为空');
            }
            if (typeof taskData.unit !== 'string' || taskData.unit.trim().length === 0) {
                throw new Error('单位不能为空');
            }
            const task = new Task_1.default(taskData);
            return await task.save();
        }
        catch (error) {
            console.error('任务服务创建任务失败:', error);
            throw error;
        }
    }
    async createTasks(tasksData) {
        return await Task_1.default.insertMany(tasksData);
    }
    async getTaskById(id) {
        return await Task_1.default.findById(id);
    }
    async getTasksByProject(projectId) {
        return await Task_1.default.find({ projectId }).sort({ createdAt: 1 });
    }
    async getTasksByDesigner(designerId, status) {
        const query = { assignedDesigners: designerId };
        if (status) {
            query.status = status;
        }
        return await Task_1.default.find(query).sort({ priority: -1, createdAt: 1 });
    }
    async getTasks(query) {
        const { page = 1, limit = 20, projectId, designerId, status, priority, settlementStatus, search } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (projectId)
            filter.projectId = projectId;
        if (designerId)
            filter.assignedDesigners = designerId;
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (settlementStatus)
            filter.settlementStatus = settlementStatus;
        if (search) {
            filter.$or = [
                { taskName: { $regex: search, $options: 'i' } },
                { remarks: { $regex: search, $options: 'i' } }
            ];
        }
        const [tasks, total] = await Promise.all([
            Task_1.default.find(filter).sort({ priority: -1, createdAt: 1 }).skip(skip).limit(limit),
            Task_1.default.countDocuments(filter)
        ]);
        return { tasks, total };
    }
    async updateTask(id, updateData, updatedBy) {
        const task = await Task_1.default.findById(id);
        if (!task) {
            return null;
        }
        const processedData = { ...updateData };
        if (updateData.specificationId === undefined) {
            processedData.specificationId = null;
        }
        const updatedTask = await Task_1.default.findByIdAndUpdate(id, processedData, { new: true });
        if (updatedTask) {
            await this.createTaskLog({
                taskId: id,
                projectId: updatedTask.projectId,
                type: 'task_update',
                title: '任务更新',
                content: `任务 "${updatedTask.taskName}" 已更新`,
                createdBy: updatedBy,
                details: { oldValue: task.toObject(), newValue: updatedTask.toObject() }
            });
        }
        return updatedTask;
    }
    async updateTaskStatus(id, status, updatedBy, progress) {
        const updateData = { status };
        if (progress !== undefined)
            updateData.progress = progress;
        if (status === 'completed')
            updateData.completedDate = new Date();
        const updatedTask = await Task_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedTask) {
            await this.createTaskLog({
                taskId: id,
                projectId: updatedTask.projectId,
                type: 'status_change',
                title: '任务状态变更',
                content: `任务状态变更为 "${status}"`,
                createdBy: updatedBy,
                details: { oldValue: { status: status }, newValue: { status, progress } }
            });
        }
        return updatedTask;
    }
    async updateTaskSettlementStatus(id, status, updatedBy) {
        const updateData = { settlementStatus: status };
        if (status === 'fully-paid')
            updateData.settlementTime = new Date();
        const updatedTask = await Task_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedTask) {
            await this.createTaskLog({
                taskId: id,
                projectId: updatedTask.projectId,
                type: 'settlement',
                title: '任务结算状态变更',
                content: `任务结算状态变更为 "${status}"`,
                createdBy: updatedBy,
                details: { oldValue: { settlementStatus: status }, newValue: { settlementStatus: status } }
            });
        }
        return updatedTask;
    }
    async assignDesigners(taskId, designerIds, updatedBy) {
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            return null;
        }
        const updatedTask = await Task_1.default.findByIdAndUpdate(taskId, { assignedDesigners: designerIds }, { new: true });
        if (updatedTask) {
            await this.createTaskLog({
                taskId,
                projectId: updatedTask.projectId,
                type: 'team_change',
                title: '设计师分配',
                content: `任务设计师已重新分配`,
                createdBy: updatedBy,
                details: {
                    oldValue: { assignedDesigners: task.assignedDesigners },
                    newValue: { assignedDesigners: designerIds }
                }
            });
        }
        return updatedTask;
    }
    async deleteTask(id, deletedBy) {
        const task = await Task_1.default.findById(id);
        if (!task) {
            return false;
        }
        await this.createTaskLog({
            taskId: id,
            projectId: task.projectId,
            type: 'system',
            title: '任务删除',
            content: `任务 "${task.taskName}" 已被删除`,
            createdBy: deletedBy
        });
        const result = await Task_1.default.findByIdAndDelete(id);
        return !!result;
    }
    async deleteTasksByProject(projectId) {
        const result = await Task_1.default.deleteMany({ projectId });
        return result.deletedCount || 0;
    }
    async getTaskStats(projectId, designerId) {
        const filter = {};
        if (projectId)
            filter.projectId = projectId;
        if (designerId)
            filter.assignedDesigners = designerId;
        const stats = await Task_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                    cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                    onHold: { $sum: { $cond: [{ $eq: ['$status', 'on-hold'] }, 1, 0] } },
                    unpaid: { $sum: { $cond: [{ $eq: ['$settlementStatus', 'unpaid'] }, 1, 0] } },
                    prepaid: { $sum: { $cond: [{ $eq: ['$settlementStatus', 'prepaid'] }, 1, 0] } },
                    draftPaid: { $sum: { $cond: [{ $eq: ['$settlementStatus', 'draft-paid'] }, 1, 0] } },
                    fullyPaid: { $sum: { $cond: [{ $eq: ['$settlementStatus', 'fully-paid'] }, 1, 0] } }
                }
            }
        ]);
        const result = stats[0] || {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0,
            onHold: 0,
            unpaid: 0,
            prepaid: 0,
            draftPaid: 0,
            fullyPaid: 0
        };
        return result;
    }
    async createTaskLog(logData) {
        const log = new ProjectLog_1.default({
            projectId: logData.projectId,
            type: logData.type,
            title: logData.title,
            content: logData.content,
            createdBy: logData.createdBy,
            details: {
                ...logData.details,
                taskId: logData.taskId
            }
        });
        await log.save();
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();
//# sourceMappingURL=TaskService.js.map