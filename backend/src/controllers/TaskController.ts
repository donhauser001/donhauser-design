import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    // 创建任务
    createTask = async (req: Request, res: Response) => {
        try {
            const task = await this.taskService.createTask(req.body);
            res.status(201).json({
                success: true,
                data: task,
                message: '任务创建成功'
            });
        } catch (error) {
            console.error('创建任务失败:', error);
            res.status(500).json({
                success: false,
                message: '创建任务失败'
            });
        }
    };

    // 批量创建任务
    createTasks = async (req: Request, res: Response) => {
        try {
            const { tasks } = req.body;
            if (!Array.isArray(tasks)) {
                return res.status(400).json({
                    success: false,
                    message: '任务数据格式错误'
                });
            }

            const createdTasks = await this.taskService.createTasks(tasks);
            res.status(201).json({
                success: true,
                data: createdTasks,
                message: `成功创建 ${createdTasks.length} 个任务`
            });
        } catch (error) {
            console.error('批量创建任务失败:', error);
            res.status(500).json({
                success: false,
                message: '批量创建任务失败'
            });
        }
    };

    // 获取任务列表
    getTasks = async (req: Request, res: Response) => {
        try {
            const { page, limit, projectId, designerId, status, priority, search } = req.query;

            const result = await this.taskService.getTasks({
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 20,
                projectId: projectId as string,
                designerId: designerId as string,
                status: status as string,
                priority: priority as string,
                search: search as string
            });

            res.json({
                success: true,
                data: result.tasks,
                pagination: {
                    page: page ? parseInt(page as string) : 1,
                    limit: limit ? parseInt(limit as string) : 20,
                    total: result.total,
                    pages: Math.ceil(result.total / (limit ? parseInt(limit as string) : 20))
                }
            });
        } catch (error) {
            console.error('获取任务列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取任务列表失败'
            });
        }
    };

    // 根据ID获取任务
    getTaskById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const task = await this.taskService.getTaskById(id);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }

            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            console.error('获取任务详情失败:', error);
            res.status(500).json({
                success: false,
                message: '获取任务详情失败'
            });
        }
    };

    // 获取项目相关的任务
    getTasksByProject = async (req: Request, res: Response) => {
        try {
            const { projectId } = req.params;
            const tasks = await this.taskService.getTasksByProject(projectId);

            res.json({
                success: true,
                data: tasks
            });
        } catch (error) {
            console.error('获取项目任务失败:', error);
            res.status(500).json({
                success: false,
                message: '获取项目任务失败'
            });
        }
    };

    // 获取设计师的任务
    getTasksByDesigner = async (req: Request, res: Response) => {
        try {
            const { designerId } = req.params;
            const { status } = req.query;
            const tasks = await this.taskService.getTasksByDesigner(designerId, status as string);

            res.json({
                success: true,
                data: tasks
            });
        } catch (error) {
            console.error('获取设计师任务失败:', error);
            res.status(500).json({
                success: false,
                message: '获取设计师任务失败'
            });
        }
    };

    // 更新任务
    updateTask = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const task = await this.taskService.updateTask(id, req.body);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }

            res.json({
                success: true,
                data: task,
                message: '任务更新成功'
            });
        } catch (error) {
            console.error('更新任务失败:', error);
            res.status(500).json({
                success: false,
                message: '更新任务失败'
            });
        }
    };

    // 更新任务状态
    updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status, progress } = req.body;

            const task = await this.taskService.updateTaskStatus(id, status, progress);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }

            res.json({
                success: true,
                data: task,
                message: '任务状态更新成功'
            });
        } catch (error) {
            console.error('更新任务状态失败:', error);
            res.status(500).json({
                success: false,
                message: '更新任务状态失败'
            });
        }
    };

    // 分配设计师
    assignDesigners = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { designerIds } = req.body;

            if (!Array.isArray(designerIds)) {
                return res.status(400).json({
                    success: false,
                    message: '设计师ID格式错误'
                });
            }

            const task = await this.taskService.assignDesigners(id, designerIds);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }

            res.json({
                success: true,
                data: task,
                message: '设计师分配成功'
            });
        } catch (error) {
            console.error('分配设计师失败:', error);
            res.status(500).json({
                success: false,
                message: '分配设计师失败'
            });
        }
    };

    // 删除任务
    deleteTask = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const success = await this.taskService.deleteTask(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: '任务不存在'
                });
            }

            res.json({
                success: true,
                message: '任务删除成功'
            });
        } catch (error) {
            console.error('删除任务失败:', error);
            res.status(500).json({
                success: false,
                message: '删除任务失败'
            });
        }
    };

    // 获取任务统计
    getTaskStats = async (req: Request, res: Response) => {
        try {
            const { projectId, designerId } = req.query;
            const stats = await this.taskService.getTaskStats(
                projectId as string,
                designerId as string
            );

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('获取任务统计失败:', error);
            res.status(500).json({
                success: false,
                message: '获取任务统计失败'
            });
        }
    };
} 