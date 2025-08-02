"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PermissionController_1 = require("../controllers/PermissionController");
const router = (0, express_1.Router)();
const permissionController = new PermissionController_1.PermissionController();
router.get('/tree', permissionController.getPermissionTree.bind(permissionController));
router.get('/all', permissionController.getAllPermissions.bind(permissionController));
router.post('/validate', permissionController.validatePermissions.bind(permissionController));
router.get('/groups', permissionController.getPermissionGroups.bind(permissionController));
router.get('/groups/:id', permissionController.getPermissionGroupById.bind(permissionController));
router.post('/groups', permissionController.createPermissionGroup.bind(permissionController));
router.put('/groups/:id', permissionController.updatePermissionGroup.bind(permissionController));
router.delete('/groups/:id', permissionController.deletePermissionGroup.bind(permissionController));
exports.default = router;
//# sourceMappingURL=permissions.js.map