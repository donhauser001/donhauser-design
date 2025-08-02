"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClientCategoryController_1 = require("../controllers/ClientCategoryController");
const router = (0, express_1.Router)();
const controller = new ClientCategoryController_1.ClientCategoryController();
router.get('/', controller.getCategories);
router.post('/', controller.createCategory);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);
exports.default = router;
//# sourceMappingURL=clientCategories.js.map