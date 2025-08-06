"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdditionalConfigController_1 = require("../controllers/AdditionalConfigController");
const router = express_1.default.Router();
router.get('/', AdditionalConfigController_1.AdditionalConfigController.getAllConfigs);
router.get('/search', AdditionalConfigController_1.AdditionalConfigController.searchConfigs);
router.get('/:id', AdditionalConfigController_1.AdditionalConfigController.getConfigById);
router.post('/', AdditionalConfigController_1.AdditionalConfigController.createConfig);
router.put('/:id', AdditionalConfigController_1.AdditionalConfigController.updateConfig);
router.patch('/:id/toggle-status', AdditionalConfigController_1.AdditionalConfigController.toggleConfigStatus);
router.delete('/:id', AdditionalConfigController_1.AdditionalConfigController.deleteConfig);
exports.default = router;
//# sourceMappingURL=additionalConfigs.js.map