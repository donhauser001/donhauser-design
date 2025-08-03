import Project, { IProject } from '../models/Project'
import { TaskService } from './TaskService'

export class ProjectService {
    /**
     * 获取项目列表
     */
    async getProjects(params: {
        page?: number
        limit?: number
        search?: string
        status?: string
        team?: string
    }): Promise<{ projects: IProject[], total: number }> {
        const { page = 1, limit = 50, search, status, team } = params
        const skip = (page - 1) * limit

        const filter: any = {}
        if (search) {
            filter.$or = [
                { projectName: { $regex: search, $options: 'i' } },
                { client: { $regex: search, $options: 'i' } },
                { contact: { $regex: search, $options: 'i' } }
            ]
        }
        if (status) filter.status = status
        if (team) filter.team = team

        const [projects, total] = await Promise.all([
            Project.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Project.countDocuments(filter)
        ])

        return { projects, total }
    }

    /**
     * 获取项目详情
     */
    async getProjectById(id: string): Promise<IProject | null> {
        return await Project.findById(id).lean()
    }

    /**
     * 创建项目
     */
    async createProject(projectData: {
        projectName: string
        client: string
        contact: string
        team: string
        mainDesigner: string[]
        assistantDesigners: string[]
        relatedOrders: string[]
        relatedTasks: Array<{
            serviceId: string
            serviceName: string
            quantity: number
            unit: string
            subtotal: number
            specification?: {
                id: string
                name: string
                length: number
                width: number
                height?: number
                unit: string
                resolution?: string
            }
        }>
        clientRequirements?: string
        startDate: Date
    }): Promise<IProject> {
        const taskService = new TaskService();

        // 创建项目
        const project = new Project({
            projectName: projectData.projectName,
            client: projectData.client,
            contact: projectData.contact,
            team: projectData.team,
            mainDesigner: projectData.mainDesigner,
            assistantDesigners: projectData.assistantDesigners,
            relatedOrders: projectData.relatedOrders,
            relatedTaskIds: [], // 先创建空数组，后面会更新
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

        // 创建任务
        if (projectData.relatedTasks && projectData.relatedTasks.length > 0) {
            const tasksData = projectData.relatedTasks.map(task => ({
                taskName: task.serviceName,
                serviceId: task.serviceId,
                projectId: savedProject._id.toString(),
                orderId: projectData.relatedOrders[0], // 假设第一个订单
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

            // 更新项目中的任务ID列表
            const taskIds = createdTasks.map(task => task._id.toString());
            await Project.findByIdAndUpdate(savedProject._id, { relatedTaskIds: taskIds });

            // 返回更新后的项目
            return await Project.findById(savedProject._id).lean() as IProject;
        }

        return savedProject;
    }

    /**
     * 更新项目
     */
    async updateProject(id: string, updateData: {
        projectName?: string
        client?: string
        contact?: string
        team?: string
        mainDesigner?: string[]
        assistantDesigners?: string[]
        relatedTaskIds?: string[]
        relatedFiles?: Array<{
            path: string;
            originalName: string;
            size: number;
        }>
        relatedTasks?: Array<{
            serviceId: string
            specification?: {
                id: string
                name: string
                length: number
                width: number
                height?: number
                unit: string
                resolution?: string
            }
        }>
        clientRequirements?: string
        status?: string
        startDate?: Date
        endDate?: Date
    }): Promise<IProject | null> {
        return await Project.findByIdAndUpdate(
            id,
            { ...updateData, updateTime: new Date() },
            { new: true }
        )
    }

    /**
     * 删除项目
     */
    async deleteProject(id: string): Promise<void> {
        const taskService = new TaskService();

        // 删除项目相关的所有任务
        await taskService.deleteTasksByProject(id);

        // 删除项目
        await Project.findByIdAndDelete(id);
    }

    /**
     * 更新项目状态
     */
    async updateProjectStatus(id: string, status: string): Promise<IProject | null> {
        return await Project.findByIdAndUpdate(
            id,
            { status, updateTime: new Date() },
            { new: true }
        )
    }

    /**
     * 获取项目统计信息
     */
    async getProjectStats(): Promise<{
        total: number
        pending: number
        inProgress: number
        completed: number
        cancelled: number
        onHold: number
    }> {
        const [total, pending, inProgress, completed, cancelled, onHold] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments({ status: 'pending' }),
            Project.countDocuments({ status: 'in-progress' }),
            Project.countDocuments({ status: 'completed' }),
            Project.countDocuments({ status: 'cancelled' }),
            Project.countDocuments({ status: 'on-hold' })
        ])

        return {
            total,
            pending,
            inProgress,
            completed,
            cancelled,
            onHold
        }
    }
}

export default new ProjectService() 