import Project, { IProject } from '../models/Project';
import ProjectLog from '../models/ProjectLog';
import { TaskService } from './TaskService';
import { UserService } from './UserService';
import { EnterpriseService } from './EnterpriseService';

export class ProjectService {
  private taskService = new TaskService();
  private userService = new UserService();
  private enterpriseService = new EnterpriseService();

  /**
   * 获取项目列表
   */
  async getProjects(params: {
    page?: number;
    limit?: number;
    search?: string;
    progressStatus?: string;
    settlementStatus?: string;
    undertakingTeam?: string;
    clientId?: string;
    excludeStatus?: string;
  }): Promise<{ projects: IProject[], total: number }> {
    const { page = 1, limit = 50, search, progressStatus, settlementStatus, undertakingTeam, clientId, excludeStatus } = params;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } }
      ];
    }
    if (progressStatus) filter.progressStatus = progressStatus;
    if (settlementStatus) filter.settlementStatus = settlementStatus;
    if (undertakingTeam) filter.undertakingTeam = undertakingTeam;
    if (clientId) filter.clientId = clientId;
    if (excludeStatus) filter.progressStatus = { $ne: excludeStatus };

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter)
    ]);

    // 为项目列表添加企业别名信息
    const projectsWithTeamNames = await Promise.all(
      projects.map(async (project) => {
        let undertakingTeamName = project.undertakingTeam;
        if (project.undertakingTeam) {
          try {
            const enterprise = await this.enterpriseService.getEnterpriseById(project.undertakingTeam);
            if (enterprise) {
              // 优先使用企业别名，如果没有则使用企业名称
              undertakingTeamName = enterprise.enterpriseAlias || enterprise.enterpriseName;
            }
          } catch (error) {
            console.error('获取企业信息失败:', error);
          }
        }
        return {
          ...project,
          undertakingTeamName
        };
      })
    );

    return { projects: projectsWithTeamNames, total };
  }

  /**
   * 根据ID获取项目详情
   */
  async getProjectById(id: string): Promise<any | null> {
    const project = await Project.findById(id).lean();

    if (!project) {
      return null;
    }

    // 获取承接团队名称
    let undertakingTeamName = project.undertakingTeam;
    if (project.undertakingTeam) {
      try {
        const enterprise = await this.enterpriseService.getEnterpriseById(project.undertakingTeam);
        if (enterprise) {
          // 优先使用企业别名，如果没有则使用企业名称
          undertakingTeamName = enterprise.enterpriseAlias || enterprise.enterpriseName;
        }
      } catch (error) {
        console.error('获取企业信息失败:', error);
      }
    }

    // 获取主创设计师姓名
    let mainDesignerNames: string[] = [];
    if (project.mainDesigners && project.mainDesigners.length > 0) {
      try {
        const designerPromises = project.mainDesigners.map(async (designerId: string) => {
          const user = await this.userService.getUserById(designerId);
          return user ? user.realName || user.username : designerId;
        });
        mainDesignerNames = await Promise.all(designerPromises);
      } catch (error) {
        console.error('获取主创设计师信息失败:', error);
        mainDesignerNames = project.mainDesigners;
      }
    }

    // 获取助理设计师姓名
    let assistantDesignerNames: string[] = [];
    if (project.assistantDesigners && project.assistantDesigners.length > 0) {
      try {
        const designerPromises = project.assistantDesigners.map(async (designerId: string) => {
          const user = await this.userService.getUserById(designerId);
          return user ? user.realName || user.username : designerId;
        });
        assistantDesignerNames = await Promise.all(designerPromises);
      } catch (error) {
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

  /**
   * 创建项目
   */
  async createProject(projectData: {
    projectName: string;
    clientId: string;
    clientName: string;
    contactIds: string[];
    contactNames: string[];
    contactPhones: string[];
    undertakingTeam: string;
    mainDesigners: string[];
    assistantDesigners: string[];
    clientRequirements?: string;
    quotationId?: string;
    remark?: string;
    tasks?: Array<{
      taskName: string;
      serviceId: string;
      assignedDesigners: string[];
      specificationId?: string;
      quantity: number;
      unit: string;
      subtotal: number;
      pricingPolicies?: Array<{
        policyId: string;
        policyName: string;
        policyType: 'uniform_discount' | 'tiered_discount';
        discountRatio: number;
        calculationDetails: string;
      }>;
      billingDescription: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      dueDate?: Date;
      remarks?: string;
    }>;
    createdBy: string;
  }): Promise<IProject> {
    const { tasks, createdBy, ...projectBasicData } = projectData;

    // 创建项目
    const project = new Project({
      ...projectBasicData,
      taskIds: [], // 先创建空数组，后面会更新
      fileIds: [],
      contractIds: [],
      invoiceIds: [],
      proposalIds: [],
      logIds: []
    });

    const savedProject = await project.save() as IProject;

    // 创建项目日志
    await this.createProjectLog({
      projectId: (savedProject as any)._id.toString(),
      type: 'system',
      title: '项目创建',
      content: `项目 "${projectData.projectName}" 已创建`,
      createdBy
    });

    // 创建任务
    if (tasks && tasks.length > 0) {
      const tasksData = tasks.map(task => ({
        ...task,
        projectId: (savedProject as any)._id.toString(),
        status: 'pending' as const,
        progress: 0,
        settlementStatus: 'unpaid' as const,
        attachmentIds: [],
        pricingPolicies: task.pricingPolicies || []
      }));

      const createdTasks = await this.taskService.createTasks(tasksData);

      // 更新项目中的任务ID列表
      const taskIds = createdTasks.map((task: any) => task._id.toString());
      await Project.findByIdAndUpdate(savedProject._id, { taskIds });

      // 创建任务创建日志
      await this.createProjectLog({
        projectId: (savedProject as any)._id.toString(),
        type: 'task_update',
        title: '任务创建',
        content: `创建了 ${tasks.length} 个任务`,
        createdBy,
        details: { relatedIds: taskIds }
      });

      // 返回更新后的项目
      return await Project.findById(savedProject._id).lean() as IProject;
    }

    return savedProject;
  }

  /**
   * 更新项目
   */
  async updateProject(id: string, updateData: {
    projectName?: string;
    clientId?: string;
    clientName?: string;
    contactIds?: string[];
    contactNames?: string[];
    contactPhones?: string[];
    undertakingTeam?: string;
    mainDesigners?: string[];
    assistantDesigners?: string[];
    progressStatus?: string;
    settlementStatus?: string;
    startedAt?: Date;
    deliveredAt?: Date;
    settledAt?: Date;
    clientRequirements?: string;
    quotationId?: string;
    remark?: string;
    updatedBy: string;
  }): Promise<IProject | null> {
    const { updatedBy, ...updateFields } = updateData;
    const project = await Project.findById(id);

    if (!project) {
      return null;
    }

    // 记录状态变更日志
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

    // 记录团队变更日志
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

    return await Project.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
  }

  /**
   * 删除项目
   */
  async deleteProject(id: string, deletedBy: string): Promise<void> {
    const project = await Project.findById(id);
    if (!project) {
      throw new Error('项目不存在');
    }

    // 删除项目相关的所有任务
    await this.taskService.deleteTasksByProject(id);

    // 创建删除日志
    await this.createProjectLog({
      projectId: id,
      type: 'system',
      title: '项目删除',
      content: `项目 "${project.projectName}" 已被删除`,
      createdBy: deletedBy
    });

    // 删除项目
    await Project.findByIdAndDelete(id);
  }

  /**
   * 更新项目状态
   */
  async updateProjectStatus(id: string, status: string, updatedBy: string): Promise<IProject | null> {
    return await this.updateProject(id, { progressStatus: status, updatedBy });
  }

  /**
   * 更新结算状态
   */
  async updateSettlementStatus(id: string, status: string, updatedBy: string): Promise<IProject | null> {
    const updateData: any = { settlementStatus: status, updatedBy };

    // 如果状态变为完全结算，设置结算时间
    if (status === 'fully-paid') {
      updateData.settledAt = new Date();
    }

    return await this.updateProject(id, updateData);
  }

  /**
   * 获取项目统计信息
   */
  async getProjectStats(): Promise<{
    total: number;
    consulting: number;
    inProgress: number;
    partialDelivery: number;
    completed: number;
    onHold: number;
    cancelled: number;
    unpaid: number;
    prepaid: number;
    partialPaid: number;
    fullyPaid: number;
  }> {
    const [
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
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ progressStatus: 'consulting' }),
      Project.countDocuments({ progressStatus: 'in-progress' }),
      Project.countDocuments({ progressStatus: 'partial-delivery' }),
      Project.countDocuments({ progressStatus: 'completed' }),
      Project.countDocuments({ progressStatus: 'on-hold' }),
      Project.countDocuments({ progressStatus: 'cancelled' }),
      Project.countDocuments({ settlementStatus: 'unpaid' }),
      Project.countDocuments({ settlementStatus: 'prepaid' }),
      Project.countDocuments({ settlementStatus: 'partial-paid' }),
      Project.countDocuments({ settlementStatus: 'fully-paid' })
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

  /**
   * 创建项目日志
   */
  async createProjectLog(logData: {
    projectId: string;
    type: string;
    title: string;
    content: string;
    createdBy: string;
    details?: any;
  }): Promise<void> {
    const log = new ProjectLog(logData);
    await log.save();

    // 更新项目的日志ID列表
    await Project.findByIdAndUpdate(
      logData.projectId,
      { $push: { logIds: (log as any)._id.toString() } }
    );
  }

  /**
   * 获取项目日志
   */
  async getProjectLogs(projectId: string, page = 1, limit = 20): Promise<{ logs: any[], total: number }> {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ProjectLog.find({ projectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProjectLog.countDocuments({ projectId })
    ]);

    return { logs, total };
  }
}

export default new ProjectService(); 