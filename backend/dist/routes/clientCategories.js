"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClientCategoryController_1 = require("../controllers/ClientCategoryController");
const router = (0, express_1.Router)();
router.get('/', ClientCategoryController_1.ClientCategoryController.getCategories);
router.post('/', ClientCategoryController_1.ClientCategoryController.createCategory);
router.put('/:id', ClientCategoryController_1.ClientCategoryController.updateCategory);
router.delete('/:id', ClientCategoryController_1.ClientCategoryController.deleteCategory);
exports.default = router;
//# sourceMappingURL=clientCategories.js.map