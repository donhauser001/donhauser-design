import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();
const taskController = new TaskController();

// 任务管理路由
router.post('/', taskController.createTask); // 创建单个任务
router.post('/batch', taskController.createTasks); // 批量创建任务
router.get('/', taskController.getTasks); // 获取任务列表
router.get('/stats', taskController.getTaskStats); // 获取任务统计

// 单个任务操作
router.get('/:id', taskController.getTaskById); // 获取任务详情
router.put('/:id', taskController.updateTask); // 更新任务
router.patch('/:id/status', taskController.updateTaskStatus); // 更新任务状态
router.patch('/:id/assign', taskController.assignDesigners); // 分配设计师
router.delete('/:id', taskController.deleteTask); // 删除任务

// 项目相关任务
router.get('/project/:projectId', taskController.getTasksByProject); // 获取项目任务

// 设计师相关任务
router.get('/designer/:designerId', taskController.getTasksByDesigner); // 获取设计师任务

export default router; 