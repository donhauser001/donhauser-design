"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EnterpriseController_1 = require("../controllers/EnterpriseController");
const router = (0, express_1.Router)();
const enterpriseController = new EnterpriseController_1.EnterpriseController();
router.get('/', enterpriseController.getEnterprises.bind(enterpriseController));
router.get('/:id', enterpriseController.getEnterpriseById.bind(enterpriseController));
router.post('/', enterpriseController.createEnterprise.bind(enterpriseController));
router.put('/:id', enterpriseController.updateEnterprise.bind(enterpriseController));
router.delete('/:id', enterpriseController.deleteEnterprise.bind(enterpriseController));
router.put('/:id/toggle-status', enterpriseController.toggleEnterpriseStatus.bind(enterpriseController));
exports.default = router;
//# sourceMappingURL=enterprises.js.map