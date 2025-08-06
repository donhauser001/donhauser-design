import { Request, Response } from 'express';
import ProjectService from '../services/ProjectService';
import { TaskService } from '../services/TaskService';

const taskService = new TaskService();

export class ProjectController {
  /**
   * 获取项目列表
   */
  static async getProjects(req: Request, res: Response) {
    try {
      const { page, limit, search, progressStatus, settlementStatus, undertakingTeam, clientId, excludeStatus } = req.query;

      const result = await ProjectService.getProjects({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        progressStatus: progressStatus as string,
        settlementStatus: settlementStatus as string,
        undertakingTeam: undertakingTeam as string,
        clientId: clientId as string,
        excludeStatus: excludeStatus as string
      });

      res.json({
        success: true,
        data: result.projects,
        total: result.total,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50
      });
    } catch (error) {
      console.error('获取项目列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取项目列表失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 根据ID获取项目详情
   */
  static async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await ProjectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        });
      }

      // 获取项目相关的任务
      const tasks = await taskService.getTasksByProject(id);

      res.json({
        success: true,
        data: {
          ...project,
          tasks
        }
      });
    } catch (error) {
      console.error('获取项目详情失败:', error);
      res.status(500).json({
        success: false,
        message: '获取项目详情失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 创建项目
   */
  static async createProject(req: Request, res: Response) {
    try {
      const { project: projectData, services: servicesData } = req.body;
      const createdBy = (req as any).user?.id || 'system';

      // 创建项目
      const project = await ProjectService.createProject({
        ...projectData,
        createdBy
      });

      // 创建任务
      if (servicesData && servicesData.length > 0) {
        const tasks = await Promise.all(
          servicesData.map(async (service: any) => {
            return await taskService.createTask({
              taskName: service.serviceName,
              projectId: project._id?.toString() || '',
              serviceId: service.serviceId,
              quantity: service.quantity,
              unit: service.unit,
              subtotal: service.subtotal,
              pricingPolicies: service.pricingPolicies?.map((policyId: string) => ({
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
          })
        );

        res.status(201).json({
          success: true,
          message: '项目创建成功',
          data: {
            project,
            tasks
          }
        });
      } else {
        res.status(201).json({
          success: true,
          message: '项目创建成功',
          data: {
            project,
            tasks: []
          }
        });
      }
    } catch (error) {
      console.error('创建项目失败:', error);
      res.status(500).json({
        success: false,
        message: '创建项目失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 更新项目
   */
  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedBy = (req as any).user?.id || 'system';

      const project = await ProjectService.updateProject(id, {
        ...updateData,
        updatedBy
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        });
      }

      res.json({
        success: true,
        message: '项目更新成功',
        data: project
      });
    } catch (error) {
      console.error('更新项目失败:', error);
      res.status(500).json({
        success: false,
        message: '更新项目失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 删除项目
   */
  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedBy = (req as any).user?.id || 'system';

      await ProjectService.deleteProject(id, deletedBy);

      res.json({
        success: true,
        message: '项目删除成功'
      });
    } catch (error) {
      console.error('删除项目失败:', error);
      res.status(500).json({
        success: false,
        message: '删除项目失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 更新项目状态
   */
  static async updateProjectStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedBy = (req as any).user?.id || 'system';

      const project = await ProjectService.updateProjectStatus(id, status, updatedBy);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        });
      }

      res.json({
        success: true,
        message: '项目状态更新成功',
        data: project
      });
    } catch (error) {
      console.error('更新项目状态失败:', error);
      res.status(500).json({
        success: false,
        message: '更新项目状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 更新结算状态
   */
  static async updateSettlementStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedBy = (req as any).user?.id || 'system';

      const project = await ProjectService.updateSettlementStatus(id, status, updatedBy);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        });
      }

      res.json({
        success: true,
        message: '结算状态更新成功',
        data: project
      });
    } catch (error) {
      console.error('更新结算状态失败:', error);
      res.status(500).json({
        success: false,
        message: '更新结算状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 获取项目统计信息
   */
  static async getProjectStats(req: Request, res: Response) {
    try {
      const stats = await ProjectService.getProjectStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('获取项目统计失败:', error);
      res.status(500).json({
        success: false,
        message: '获取项目统计失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 获取项目日志
   */
  static async getProjectLogs(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;

      const result = await ProjectService.getProjectLogs(
        id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );

      res.json({
        success: true,
        data: result.logs,
        total: result.total,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20
      });
    } catch (error) {
      console.error('获取项目日志失败:', error);
      res.status(500).json({
        success: false,
        message: '获取项目日志失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
}

export default ProjectController; 