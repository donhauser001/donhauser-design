"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PricingPolicyController_1 = require("../controllers/PricingPolicyController");
const router = express_1.default.Router();
router.get('/', PricingPolicyController_1.PricingPolicyController.getAllPolicies);
router.get('/search', PricingPolicyController_1.PricingPolicyController.searchPolicies);
router.get('/:id', PricingPolicyController_1.PricingPolicyController.getPolicyById);
router.post('/', PricingPolicyController_1.PricingPolicyController.createPolicy);
router.put('/:id', PricingPolicyController_1.PricingPolicyController.updatePolicy);
router.patch('/:id/toggle-status', PricingPolicyController_1.PricingPolicyController.togglePolicyStatus);
router.delete('/:id', PricingPolicyController_1.PricingPolicyController.deletePolicy);
exports.default = router;
//# sourceMappingURL=pricingPolicies.js.map