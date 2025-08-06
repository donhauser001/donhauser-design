"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const Task_1 = __importDefault(require("../models/Task"));
class TaskService {
    async createTask(taskData) {
        try {
            const requiredFields = ['taskName', 'serviceId', 'projectId', 'quantity', 'unit', 'subtotal'];
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
        const { page = 1, limit = 20, projectId, designerId, status, priority, search } = query;
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
    async updateTask(id, updateData) {
        const processedData = { ...updateData };
        if (updateData.specification === undefined) {
            processedData.specification = null;
        }
        return await Task_1.default.findByIdAndUpdate(id, processedData, { new: true });
    }
    async updateTaskStatus(id, status, progress) {
        const updateData = { status };
        if (progress !== undefined)
            updateData.progress = progress;
        if (status === 'completed')
            updateData.completedDate = new Date();
        return await Task_1.default.findByIdAndUpdate(id, updateData, { new: true });
    }
    async assignDesigners(taskId, designerIds) {
        return await Task_1.default.findByIdAndUpdate(taskId, { assignedDesigners: designerIds }, { new: true });
    }
    async deleteTask(id) {
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
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const result = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0,
            onHold: 0
        };
        stats.forEach(stat => {
            result.total += stat.count;
            switch (stat._id) {
                case 'pending':
                    result.pending = stat.count;
                    break;
                case 'in-progress':
                    result.inProgress = stat.count;
                    break;
                case 'completed':
                    result.completed = stat.count;
                    break;
                case 'cancelled':
                    result.cancelled = stat.count;
                    break;
                case 'on-hold':
                    result.onHold = stat.count;
                    break;
            }
        });
        return result;
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map