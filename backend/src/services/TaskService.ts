import Task, { ITask } from '../models/Task';
import ProjectLog from '../models/ProjectLog';
import { UserService } from './UserService';

class TaskService {
    private userService = new UserService();
    /**
     * 创建任务
     */
    async createTask(taskData: Partial<ITask>): Promise<ITask> {
        try {
            // 验证必填字段
            const requiredFields = ['taskName', 'serviceId', 'projectId', 'quantity', 'unit', 'subtotal', 'billingDescription'];
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

    /**
 * 批量创建任务
 */
    async createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]> {
        return await Task.insertMany(tasksData) as ITask[];
    }

    /**
     * 根据ID获取任务
     */
    async getTaskById(id: string): Promise<ITask | null> {
        return await Task.findById(id);
    }

    /**
     * 获取项目相关的所有任务
     */
    async getTasksByProject(projectId: string): Promise<any[]> {
        const tasks = await Task.find({ projectId }).sort({ createdAt: 1 });

        // 为每个任务获取设计师名字
        const tasksWithDesignerNames = await Promise.all(
            tasks.map(async (task) => {
                let mainDesignerNames: string[] = [];
                let assistantDesignerNames: string[] = [];

                // 获取主创设计师名字
                if (task.mainDesigners && task.mainDesigners.length > 0) {
                    try {
                        const designerPromises = task.mainDesigners.map(async (designerId: string) => {
                            const user = await this.userService.getUserById(designerId);
                            return user ? user.realName || user.username : designerId;
                        });
                        mainDesignerNames = await Promise.all(designerPromises);
                    } catch (error) {
                        console.error('获取主创设计师信息失败:', error);
                        mainDesignerNames = task.mainDesigners;
                    }
                }

                // 获取助理设计师名字
                if (task.assistantDesigners && task.assistantDesigners.length > 0) {
                    try {
                        const designerPromises = task.assistantDesigners.map(async (designerId: string) => {
                            const user = await this.userService.getUserById(designerId);
                            return user ? user.realName || user.username : designerId;
                        });
                        assistantDesignerNames = await Promise.all(designerPromises);
                    } catch (error) {
                        console.error('获取助理设计师信息失败:', error);
                        assistantDesignerNames = task.assistantDesigners;
                    }
                }

                return {
                    ...task.toObject(),
                    mainDesignerNames,
                    assistantDesignerNames
                };
            })
        );

        return tasksWithDesignerNames;
    }

    /**
     * 获取设计师分配的任务
     */
    async getTasksByDesigner(designerId: string, status?: string): Promise<ITask[]> {
        const query: any = {
            $or: [
                { mainDesigners: designerId },
                { assistantDesigners: designerId }
            ]
        };
        if (status) {
            query.status = status;
        }
        return await Task.find(query).sort({ priority: -1, createdAt: 1 });
    }

    /**
     * 获取任务列表（支持分页和筛选）
     */
    async getTasks(query: {
        page?: number;
        limit?: number;
        projectId?: string;
        designerId?: string;
        status?: string;
        priority?: string;
        settlementStatus?: string;
        search?: string;
    }): Promise<{ tasks: ITask[]; total: number }> {
        const { page = 1, limit = 20, projectId, designerId, status, priority, settlementStatus, search } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        if (designerId) {
            filter.$or = [
                { mainDesigners: designerId },
                { assistantDesigners: designerId }
            ];
        }
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (settlementStatus) filter.settlementStatus = settlementStatus;
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

    /**
     * 更新任务
     */
    async updateTask(id: string, updateData: Partial<ITask>, updatedBy: string): Promise<ITask | null> {
        const task = await Task.findById(id);
        if (!task) {
            return null;
        }

        // 处理 undefined 值，将其转换为 null 以便 Mongoose 正确处理
        const processedData: any = { ...updateData };

        // 如果 specificationId 是 undefined，设置为 null 来清除该字段
        if (updateData.specificationId === undefined) {
            processedData.specificationId = null;
        }

        const updatedTask = await Task.findByIdAndUpdate(id, processedData, { new: true });

        // 记录任务更新日志
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

    /**
     * 更新任务状态
     */
    async updateTaskStatus(id: string, status: string, updatedBy: string, progress?: number): Promise<ITask | null> {
        const updateData: any = { status };
        if (progress !== undefined) updateData.progress = progress;
        if (status === 'completed') updateData.completedDate = new Date();

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        // 记录状态变更日志
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

    /**
     * 更新任务结算状态
     */
    async updateTaskSettlementStatus(id: string, status: string, updatedBy: string): Promise<ITask | null> {
        const updateData: any = { settlementStatus: status };
        if (status === 'fully-paid') updateData.settlementTime = new Date();

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        // 记录结算状态变更日志
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

    /**
     * 分配设计师
     */
    async assignDesigners(taskId: string, mainDesignerIds: string[], assistantDesignerIds: string[], updatedBy: string): Promise<ITask | null> {
        const task = await Task.findById(taskId);
        if (!task) {
            return null;
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                mainDesigners: mainDesignerIds,
                assistantDesigners: assistantDesignerIds
            },
            { new: true }
        );

        // 记录设计师分配日志
        if (updatedTask) {
            await this.createTaskLog({
                taskId,
                projectId: updatedTask.projectId,
                type: 'team_change',
                title: '设计师分配',
                content: `任务设计师已重新分配`,
                createdBy: updatedBy,
                details: {
                    oldValue: {
                        mainDesigners: task.mainDesigners,
                        assistantDesigners: task.assistantDesigners
                    },
                    newValue: {
                        mainDesigners: mainDesignerIds,
                        assistantDesigners: assistantDesignerIds
                    }
                }
            });
        }

        return updatedTask;
    }

    /**
     * 删除任务
     */
    async deleteTask(id: string, deletedBy: string): Promise<boolean> {
        const task = await Task.findById(id);
        if (!task) {
            return false;
        }

        // 记录删除日志
        await this.createTaskLog({
            taskId: id,
            projectId: task.projectId,
            type: 'system',
            title: '任务删除',
            content: `任务 "${task.taskName}" 已被删除`,
            createdBy: deletedBy
        });

        const result = await Task.findByIdAndDelete(id);
        return !!result;
    }

    /**
     * 删除项目相关的所有任务
     */
    async deleteTasksByProject(projectId: string): Promise<number> {
        const result = await Task.deleteMany({ projectId });
        return result.deletedCount || 0;
    }

    /**
     * 获取任务统计信息
     */
    async getTaskStats(projectId?: string, designerId?: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        onHold: number;
        unpaid: number;
        prepaid: number;
        draftPaid: number;
        fullyPaid: number;
    }> {
        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        if (designerId) {
            filter.$or = [
                { mainDesigners: designerId },
                { assistantDesigners: designerId }
            ];
        }

        const stats = await Task.aggregate([
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

    /**
     * 创建任务日志
     */
    async createTaskLog(logData: {
        taskId: string;
        projectId: string;
        type: string;
        title: string;
        content: string;
        createdBy: string;
        details?: any;
    }): Promise<void> {
        const log = new ProjectLog({
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

export { TaskService };
export default new TaskService(); 