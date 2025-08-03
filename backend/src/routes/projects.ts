import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'

const router = Router()
const projectController = new ProjectController()

// 获取项目列表
router.get('/', projectController.getProjects)

// 获取项目统计信息
router.get('/stats', projectController.getProjectStats)

// 获取项目任务列表
router.get('/:id/tasks', projectController.getProjectTasks)

// 获取项目详情
router.get('/:id', projectController.getProjectById)

// 创建项目
router.post('/', projectController.createProject)

// 更新项目
router.put('/:id', projectController.updateProject)

// 删除项目
router.delete('/:id', projectController.deleteProject)

// 更新项目状态
router.patch('/:id/status', projectController.updateProjectStatus)

export default router 