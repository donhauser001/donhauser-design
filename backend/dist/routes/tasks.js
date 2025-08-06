"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const router = (0, express_1.Router)();
const taskController = new TaskController_1.TaskController();
router.post('/', taskController.createTask);
router.post('/batch', taskController.createTasks);
router.get('/', taskController.getTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.patch('/:id/assign', taskController.assignDesigners);
router.delete('/:id', taskController.deleteTask);
router.get('/project/:projectId', taskController.getTasksByProject);
router.get('/designer/:designerId', taskController.getTasksByDesigner);
exports.default = router;
//# sourceMappingURL=tasks.js.map