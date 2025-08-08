"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
const router = (0, express_1.Router)();
router.get('/', ProjectController_1.default.getProjects);
router.get('/stats', ProjectController_1.default.getProjectStats);
router.get('/:id', ProjectController_1.default.getProjectById);
router.get('/:id/logs', ProjectController_1.default.getProjectLogs);
router.post('/', ProjectController_1.default.createProject);
router.put('/:id', ProjectController_1.default.updateProject);
router.patch('/:id/status', ProjectController_1.default.updateProjectStatus);
router.patch('/:id/settlement', ProjectController_1.default.updateSettlementStatus);
router.delete('/:id', ProjectController_1.default.deleteProject);
exports.default = router;
//# sourceMappingURL=projects.js.map