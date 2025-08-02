"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DepartmentController_1 = require("../controllers/DepartmentController");
const router = (0, express_1.Router)();
const departmentController = new DepartmentController_1.DepartmentController();
router.get('/', departmentController.getDepartments.bind(departmentController));
router.get('/:id', departmentController.getDepartmentById.bind(departmentController));
router.post('/', departmentController.createDepartment.bind(departmentController));
router.put('/:id', departmentController.updateDepartment.bind(departmentController));
router.delete('/:id', departmentController.deleteDepartment.bind(departmentController));
router.get('/parent-options/:enterpriseId', departmentController.getParentDepartmentOptions.bind(departmentController));
router.put('/:id/toggle-status', departmentController.toggleDepartmentStatus.bind(departmentController));
exports.default = router;
//# sourceMappingURL=departments.js.map