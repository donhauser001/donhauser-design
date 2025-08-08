"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = __importDefault(require("../controllers/TaskController"));
const router = (0, express_1.Router)();
router.get('/', TaskController_1.default.getTasks);
router.get('/stats', TaskController_1.default.getTaskStats);
router.get('/:id', TaskController_1.default.getTaskById);
router.get('/project/:projectId', TaskController_1.default.getTasksByProject);
router.get('/designer/:designerId', TaskController_1.default.getTasksByDesigner);
router.post('/', TaskController_1.default.createTask);
router.post('/batch', TaskController_1.default.createTasks);
router.put('/:id', TaskController_1.default.updateTask);
router.patch('/:id/status', TaskController_1.default.updateTaskStatus);
router.patch('/:id/settlement', TaskController_1.default.updateTaskSettlementStatus);
router.patch('/:id/assign', TaskController_1.default.assignDesigners);
router.delete('/:id', TaskController_1.default.deleteTask);
exports.default = router;
//# sourceMappingURL=tasks.js.map