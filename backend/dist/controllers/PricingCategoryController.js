"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingCategoryController = void 0;
const PricingCategoryService_1 = require("../services/PricingCategoryService");
class PricingCategoryController {
    constructor() {
        this.service = new PricingCategoryService_1.PricingCategoryService();
        this.getCategories = (req, res) => {
            res.json({ success: true, data: this.service.getCategories() });
        };
        this.createCategory = (req, res) => {
            try {
                const category = this.service.createCategory(req.body);
                res.json({ success: true, data: category });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        };
        this.updateCategory = (req, res) => {
            try {
                const category = this.service.updateCategory(req.params.id, req.body);
                if (!category) {
                    res.status(404).json({ success: false, message: '分类不存在' });
                    return;
                }
                res.json({ success: true, data: category });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        };
        this.deleteCategory = (req, res) => {
            const ok = this.service.deleteCategory(req.params.id);
            if (!ok) {
                res.status(404).json({ success: false, message: '分类不存在' });
                return;
            }
            res.json({ success: true });
        };
    }
}
exports.PricingCategoryController = PricingCategoryController;
//# sourceMappingURL=PricingCategoryController.js.map