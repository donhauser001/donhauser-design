"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderVersionController_1 = require("../controllers/OrderVersionController");
const router = (0, express_1.Router)();
const orderVersionController = new OrderVersionController_1.OrderVersionController();
router.post('/', orderVersionController.createOrderVersion.bind(orderVersionController));
router.get('/:orderId', orderVersionController.getOrderVersions.bind(orderVersionController));
router.get('/:orderId/:versionNumber', orderVersionController.getOrderVersion.bind(orderVersionController));
router.get('/:orderId/latest', orderVersionController.getLatestOrderVersion.bind(orderVersionController));
router.delete('/:orderId', orderVersionController.deleteOrderVersions.bind(orderVersionController));
exports.default = router;
//# sourceMappingURL=orderVersions.js.map