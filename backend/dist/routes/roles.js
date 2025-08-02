"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoleController_1 = require("../controllers/RoleController");
const router = (0, express_1.Router)();
router.get('/', RoleController_1.RoleController.getRoles);
router.get('/all', RoleController_1.RoleController.getAllRoles);
router.get('/:id', RoleController_1.RoleController.getRoleById);
router.post('/', RoleController_1.RoleController.createRole);
router.put('/:id', RoleController_1.RoleController.updateRole);
router.delete('/:id', RoleController_1.RoleController.deleteRole);
exports.default = router;
//# sourceMappingURL=roles.js.map