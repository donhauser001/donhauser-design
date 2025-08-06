"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const router = (0, express_1.Router)();
const projectController = new ProjectController_1.ProjectController();
router.get('/', projectController.getProjects);
router.get('/stats', projectController.getProjectStats);
router.get('/:id/tasks', projectController.getProjectTasks);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.patch('/:id/status', projectController.updateProjectStatus);
exports.default = router;
//# sourceMappingURL=projects.js.map