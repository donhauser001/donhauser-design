"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServiceProcessController_1 = __importDefault(require("../controllers/ServiceProcessController"));
const router = express_1.default.Router();
router.get('/', ServiceProcessController_1.default.getAllProcesses);
router.get('/search', ServiceProcessController_1.default.searchProcesses);
router.get('/:id', ServiceProcessController_1.default.getProcessById);
router.post('/', ServiceProcessController_1.default.createProcess);
router.put('/:id', ServiceProcessController_1.default.updateProcess);
router.patch('/:id/toggle-status', ServiceProcessController_1.default.toggleProcessStatus);
router.delete('/:id', ServiceProcessController_1.default.deleteProcess);
exports.default = router;
//# sourceMappingURL=serviceProcesses.js.map