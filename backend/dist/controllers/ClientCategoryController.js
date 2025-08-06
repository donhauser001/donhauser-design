"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCategoryController = void 0;
const ClientCategoryService_1 = require("../services/ClientCategoryService");
class ClientCategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await ClientCategoryService_1.ClientCategoryService.getCategories();
            res.json({
                success: true,
                message: '获取客户分类成功',
                data: categories
            });
        }
        catch (error) {
            console.error('获取客户分类失败:', error);
            res.status(500).json({
                success: false,
                message: '获取客户分类失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async createCategory(req, res) {
        try {
            const category = await ClientCategoryService_1.ClientCategoryService.createCategory(req.body);
            res.status(201).json({
                success: true,
                message: '客户分类创建成功',
                data: category
            });
        }
        catch (error) {
            console.error('创建客户分类失败:', error);
            res.status(400).json({
                success: false,
                message: error.message || '创建客户分类失败'
            });
        }
    }
    static async updateCategory(req, res) {
        try {
            const category = await ClientCategoryService_1.ClientCategoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: '客户分类不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '客户分类更新成功',
                data: category
            });
        }
        catch (error) {
            console.error('更新客户分类失败:', error);
            res.status(400).json({
                success: false,
                message: error.message || '更新客户分类失败'
            });
        }
    }
    static async deleteCategory(req, res) {
        try {
            const success = await ClientCategoryService_1.ClientCategoryService.deleteCategory(req.params.id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '客户分类不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '客户分类删除成功'
            });
        }
        catch (error) {
            console.error('删除客户分类失败:', error);
            res.status(500).json({
                success: false,
                message: '删除客户分类失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.ClientCategoryController = ClientCategoryController;
//# sourceMappingURL=ClientCategoryController.js.map