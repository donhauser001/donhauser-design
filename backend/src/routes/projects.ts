import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';

const router = Router();

// 获取项目列表
router.get('/', ProjectController.getProjects);

// 获取项目统计信息
router.get('/stats', ProjectController.getProjectStats);

// 根据ID获取项目详情
router.get('/:id', ProjectController.getProjectById);

// 获取项目日志
router.get('/:id/logs', ProjectController.getProjectLogs);

// 创建项目
router.post('/', ProjectController.createProject);

// 更新项目
router.put('/:id', ProjectController.updateProject);

// 更新项目状态
router.patch('/:id/status', ProjectController.updateProjectStatus);

// 更新结算状态
router.patch('/:id/settlement', ProjectController.updateSettlementStatus);

// 删除项目
router.delete('/:id', ProjectController.deleteProject);

export default router; 