"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SpecificationController_1 = require("../controllers/SpecificationController");
const router = (0, express_1.Router)();
const specificationController = new SpecificationController_1.SpecificationController();
router.get('/', specificationController.getSpecifications);
router.get('/defaults', specificationController.getDefaultSpecifications);
router.get('/:id', specificationController.getSpecificationById);
router.post('/', specificationController.createSpecification);
router.put('/:id', specificationController.updateSpecification);
router.delete('/:id', specificationController.deleteSpecification);
router.patch('/:id/default', specificationController.setDefaultSpecification);
exports.default = router;
//# sourceMappingURL=specifications.js.map