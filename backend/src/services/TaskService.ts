import Task, { ITask } from '../models/Task';

export class TaskService {
    // 创建任务
    async createTask(taskData: Partial<ITask>): Promise<ITask> {
        try {
            // 验证必填字段
            const requiredFields = ['taskName', 'serviceId', 'projectId', 'quantity', 'unit', 'subtotal'];
            const missingFields = requiredFields.filter(field => !taskData[field as keyof ITask]);
            
            if (missingFields.length > 0) {
                throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
            }
            
            // 验证数值字段
            if (typeof taskData.quantity !== 'number' || taskData.quantity <= 0) {
                throw new Error('数量必须是大于0的数字');
            }
            
            if (typeof taskData.subtotal !== 'number' || taskData.subtotal < 0) {
                throw new Error('小计金额不能为负数');
            }
            
            // 验证字符串字段
            if (typeof taskData.taskName !== 'string' || taskData.taskName.trim().length === 0) {
                throw new Error('任务名称不能为空');
            }
            
            if (typeof taskData.unit !== 'string' || taskData.unit.trim().length === 0) {
                throw new Error('单位不能为空');
            }
            
            // 创建任务
            const task = new Task(taskData);
            return await task.save();
        } catch (error) {
            console.error('任务服务创建任务失败:', error);
            throw error;
        }
    }

    // 批量创建任务
    async createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]> {
        return await Task.insertMany(tasksData);
    }

    // 根据ID获取任务
    async getTaskById(id: string): Promise<ITask | null> {
        return await Task.findById(id);
    }

    // 获取项目相关的所有任务
    async getTasksByProject(projectId: string): Promise<ITask[]> {
        return await Task.find({ projectId }).sort({ createdAt: 1 });
    }

    // 获取设计师分配的任务
    async getTasksByDesigner(designerId: string, status?: string): Promise<ITask[]> {
        const query: any = { assignedDesigners: designerId };
        if (status) {
            query.status = status;
        }
        return await Task.find(query).sort({ priority: -1, createdAt: 1 });
    }

    // 获取任务列表（支持分页和筛选）
    async getTasks(query: {
        page?: number;
        limit?: number;
        projectId?: string;
        designerId?: string;
        status?: string;
        priority?: string;
        search?: string;
    }): Promise<{ tasks: ITask[]; total: number }> {
        const { page = 1, limit = 20, projectId, designerId, status, priority, search } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        if (designerId) filter.assignedDesigners = designerId;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.$or = [
                { taskName: { $regex: search, $options: 'i' } },
                { remarks: { $regex: search, $options: 'i' } }
            ];
        }

        const [tasks, total] = await Promise.all([
            Task.find(filter).sort({ priority: -1, createdAt: 1 }).skip(skip).limit(limit),
            Task.countDocuments(filter)
        ]);

        return { tasks, total };
    }

    // 更新任务
    async updateTask(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
        // 处理 undefined 值，将其转换为 null 以便 Mongoose 正确处理
        const processedData: any = { ...updateData };

        // 如果 specification 是 undefined，设置为 null 来清除该字段
        if (updateData.specification === undefined) {
            processedData.specification = null;
        }

        return await Task.findByIdAndUpdate(id, processedData, { new: true });
    }

    // 更新任务状态
    async updateTaskStatus(id: string, status: string, progress?: number): Promise<ITask | null> {
        const updateData: any = { status };
        if (progress !== undefined) updateData.progress = progress;
        if (status === 'completed') updateData.completedDate = new Date();

        return await Task.findByIdAndUpdate(id, updateData, { new: true });
    }

    // 分配设计师
    async assignDesigners(taskId: string, designerIds: string[]): Promise<ITask | null> {
        return await Task.findByIdAndUpdate(
            taskId,
            { assignedDesigners: designerIds },
            { new: true }
        );
    }

    // 删除任务
    async deleteTask(id: string): Promise<boolean> {
        const result = await Task.findByIdAndDelete(id);
        return !!result;
    }

    // 删除项目相关的所有任务
    async deleteTasksByProject(projectId: string): Promise<number> {
        const result = await Task.deleteMany({ projectId });
        return result.deletedCount || 0;
    }

    // 获取任务统计信息
    async getTaskStats(projectId?: string, designerId?: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        onHold: number;
    }> {
        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        if (designerId) filter.assignedDesigners = designerId;

        const stats = await Task.aggregate([
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