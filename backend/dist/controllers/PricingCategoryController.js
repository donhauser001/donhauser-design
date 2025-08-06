"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingCategoryController = void 0;
const PricingCategoryService_1 = require("../services/PricingCategoryService");
class PricingCategoryController {
    constructor() {
        this.getCategories = async (req, res) => {
            try {
                const categories = await PricingCategoryService_1.PricingCategoryService.getCategories();
                res.json({ success: true, data: categories });
            }
            catch (error) {
                res.status(500).json({ success: false, message: '获取分类列表失败' });
            }
        };
        this.getCategoryById = async (req, res) => {
            try {
                const category = await PricingCategoryService_1.PricingCategoryService.getCategoryById(req.params.id);
                if (!category) {
                    res.status(404).json({ success: false, message: '分类不存在' });
                    return;
                }
                res.json({ success: true, data: category });
            }
            catch (error) {
                res.status(500).json({ success: false, message: '获取分类详情失败' });
            }
        };
        this.createCategory = async (req, res) => {
            try {
                const category = await PricingCategoryService_1.PricingCategoryService.createCategory(req.body);
                res.json({ success: true, data: category });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        };
        this.updateCategory = async (req, res) => {
            try {
                const category = await PricingCategoryService_1.PricingCategoryService.updateCategory(req.params.id, req.body);
                if (!category) {
                    res.status(404).json({ success: false, message: '分类不存在' });
                    return;
                }
                res.json({ success: true, data: category });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        };
        this.deleteCategory = async (req, res) => {
            try {
                const success = await PricingCategoryService_1.PricingCategoryService.deleteCategory(req.params.id);
                if (!success) {
                    res.status(404).json({ success: false, message: '分类不存在' });
                    return;
                }
                res.json({ success: true, message: '删除成功' });
            }
            catch (error) {
                res.status(500).json({ success: false, message: '删除分类失败' });
            }
        };
        this.toggleCategoryStatus = async (req, res) => {
            try {
                const category = await PricingCategoryService_1.PricingCategoryService.toggleCategoryStatus(req.params.id);
                if (!category) {
                    res.status(404).json({ success: false, message: '分类不存在' });
                    return;
                }
                res.json({ success: true, data: category });
            }
            catch (error) {
                res.status(500).json({ success: false, message: '切换分类状态失败' });
            }
        };
        this.searchCategories = async (req, res) => {
            try {
                const { q } = req.query;
                if (!q || typeof q !== 'string') {
                    res.status(400).json({ success: false, message: '搜索关键词不能为空' });
                    return;
                }
                const categories = await PricingCategoryService_1.PricingCategoryService.searchCategories(q);
                res.json({ success: true, data: categories });
            }
            catch (error) {
                res.status(500).json({ success: false, message: '搜索分类失败' });
            }
        };
    }
}
exports.PricingCategoryController = PricingCategoryController;
//# sourceMappingURL=PricingCategoryController.js.map