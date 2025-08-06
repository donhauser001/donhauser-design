"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuotationController_1 = __importDefault(require("../controllers/QuotationController"));
const router = (0, express_1.Router)();
router.get('/', QuotationController_1.default.getAllQuotations);
router.get('/search', QuotationController_1.default.searchQuotations);
router.get('/:id', QuotationController_1.default.getQuotationById);
router.post('/', QuotationController_1.default.createQuotation);
router.put('/:id', QuotationController_1.default.updateQuotation);
router.delete('/:id', QuotationController_1.default.deleteQuotation);
router.patch('/:id/toggle-status', QuotationController_1.default.toggleQuotationStatus);
router.get('/client/:clientId', QuotationController_1.default.getQuotationsByClientId);
exports.default = router;
//# sourceMappingURL=quotations.js.map