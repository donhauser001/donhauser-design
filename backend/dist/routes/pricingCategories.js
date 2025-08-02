"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PricingCategoryController_1 = require("../controllers/PricingCategoryController");
const router = (0, express_1.Router)();
const controller = new PricingCategoryController_1.PricingCategoryController();
router.get('/', controller.getCategories);
router.post('/', controller.createCategory);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);
exports.default = router;
//# sourceMappingURL=pricingCategories.js.map