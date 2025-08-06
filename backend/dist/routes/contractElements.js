"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContractElementController_1 = __importDefault(require("../controllers/ContractElementController"));
const router = express_1.default.Router();
router.get('/', ContractElementController_1.default.getList);
router.get('/active', ContractElementController_1.default.getActiveElements);
router.get('/:id', ContractElementController_1.default.getById);
router.post('/', ContractElementController_1.default.create);
router.put('/:id', ContractElementController_1.default.update);
router.delete('/:id', ContractElementController_1.default.delete);
exports.default = router;
//# sourceMappingURL=contractElements.js.map