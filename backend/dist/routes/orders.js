"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderController_1 = __importDefault(require("../controllers/OrderController"));
const router = express_1.default.Router();
router.get('/', OrderController_1.default.getOrders);
router.post('/', OrderController_1.default.createOrder);
router.get('/:orderId', OrderController_1.default.getOrderById);
router.put('/:orderId', OrderController_1.default.updateOrder);
router.get('/:orderId/versions', OrderController_1.default.getOrderVersionHistory);
router.get('/:orderId/versions/:version', OrderController_1.default.getOrderSnapshot);
router.patch('/:orderId/status', OrderController_1.default.updateOrderStatus);
router.delete('/:orderId', OrderController_1.default.deleteOrder);
exports.default = router;
//# sourceMappingURL=orders.js.map