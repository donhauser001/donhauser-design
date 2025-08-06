"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServicePricingController_1 = require("../controllers/ServicePricingController");
const router = express_1.default.Router();
router.get('/', ServicePricingController_1.ServicePricingController.getAllServicePricing);
router.get('/search', ServicePricingController_1.ServicePricingController.searchServicePricing);
router.get('/by-ids', ServicePricingController_1.ServicePricingController.getServicePricingByIds);
router.get('/:id', ServicePricingController_1.ServicePricingController.getServicePricingById);
router.post('/', ServicePricingController_1.ServicePricingController.createServicePricing);
router.put('/:id', ServicePricingController_1.ServicePricingController.updateServicePricing);
router.patch('/:id/toggle-status', ServicePricingController_1.ServicePricingController.toggleServicePricingStatus);
router.delete('/:id', ServicePricingController_1.ServicePricingController.deleteServicePricing);
exports.default = router;
//# sourceMappingURL=servicePricing.js.map