import { Request, Response } from 'express'
import ProjectService from '../services/ProjectService'
import { TaskService } from '../services/TaskService'

export class ProjectController {
    /**
     * 获取项目列表
     */
    async getProjects(req: Request, res: Response) {
        try {
            const { page = 1, limit = 50, search, status, team } = req.query

            const result = await ProjectService.getProjects({
                page: Number(page),
                limit: Number(limit),
                search: search as string,
                status: status as string,
                team: team as string
            })

            res.json({
                success: true,
                data: result.projects,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: result.total,
                    pages: Math.ceil(result.total / Number(limit))
                }
            })
        } catch (error) {
            console.error('获取项目列表失败:', error)
            res.status(500).json({
                success: false,
                message: '获取项目列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 获取项目详情
     */
    async getProjectById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const project = await ProjectService.getProjectById(id)
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: '项目不存在'
                })
            }

            res.json({
                success: true,
                data: project
            })
        } catch (error) {
            console.error('获取项目详情失败:', error)
            res.status(500).json({
                success: false,
                message: '获取项目详情失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 创建项目
     */
    async createProject(req: Request, res: Response) {
        try {
            const {
                projectName,
                client,
                contact,
                team,
                mainDesigner,
                assistantDesigners,
                relatedOrders,
                relatedTasks,
                clientRequirements,
                startDate
            } = req.body

            const project = await ProjectService.createProject({
                projectName,
                client,
                contact,
                team,
                mainDesigner,
                assistantDesigners,
                relatedOrders,
                relatedTasks,
                clientRequirements,
                startDate: new Date(startDate)
            })

            res.status(201).json({
                success: true,
                data: project,
                message: '项目创建成功'
            })
        } catch (error) {
            console.error('创建项目失败:', error)
            res.status(500).json({
                success: false,
                message: '创建项目失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 更新项目
     */
    async updateProject(req: Request, res: Response) {
        try {
            const { id } = req.params
            const updateData = req.body

            const project = await ProjectService.updateProject(id, updateData)

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: '项目不存在'
                })
            }

            res.json({
                success: true,
                data: project,
                message: '项目更新成功'
            })
        } catch (error) {
            console.error('更新项目失败:', error)
            res.status(500).json({
                success: false,
                message: '更新项目失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 删除项目
     */
    async deleteProject(req: Request, res: Response) {
        try {
            const { id } = req.params

            await ProjectService.deleteProject(id)

            res.json({
                success: true,
                message: '项目删除成功'
            })
        } catch (error) {
            console.error('删除项目失败:', error)
            res.status(500).json({
                success: false,
                message: '删除项目失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 更新项目状态
     */
    async updateProjectStatus(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { status } = req.body

            const project = await ProjectService.updateProjectStatus(id, status)

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: '项目不存在'
                })
            }

            res.json({
                success: true,
                data: project,
                message: '项目状态更新成功'
            })
        } catch (error) {
            console.error('更新项目状态失败:', error)
            res.status(500).json({
                success: false,
                message: '更新项目状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 获取项目统计信息
     */
    async getProjectStats(req: Request, res: Response) {
        try {
            const stats = await ProjectService.getProjectStats()

            res.json({
                success: true,
                data: stats
            })
        } catch (error) {
            console.error('获取项目统计失败:', error)
            res.status(500).json({
                success: false,
                message: '获取项目统计失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }

    /**
     * 获取项目任务列表
     */
    async getProjectTasks(req: Request, res: Response) {
        try {
            const { id } = req.params
            const taskService = new TaskService()

            const tasks = await taskService.getTasksByProject(id)

            res.json({
                success: true,
                data: tasks
            })
        } catch (error) {
            console.error('获取项目任务失败:', error)
            res.status(500).json({
                success: false,
                message: '获取项目任务失败',
                error: error instanceof Error ? error.message : '未知错误'
            })
        }
    }
} 