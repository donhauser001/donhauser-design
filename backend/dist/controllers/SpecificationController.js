"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecificationController = void 0;
const SpecificationService_1 = __importDefault(require("../services/SpecificationService"));
class SpecificationController {
    async getSpecifications(req, res) {
        try {
            const { page = 1, limit = 50, search, category, isDefault } = req.query;
            const result = await SpecificationService_1.default.getSpecifications({
                page: Number(page),
                limit: Number(limit),
                search: search,
                category: category,
                isDefault: isDefault === 'true'
            });
            res.json({
                success: true,
                data: result.specifications,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: result.total,
                    pages: Math.ceil(result.total / Number(limit))
                }
            });
        }
        catch (error) {
            console.error('获取规格列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取规格列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getSpecificationById(req, res) {
        try {
            const { id } = req.params;
            const specification = await SpecificationService_1.default.getSpecificationById(id);
            if (!specification) {
                return res.status(404).json({
                    success: false,
                    message: '规格不存在'
                });
            }
            res.json({
                success: true,
                data: specification
            });
        }
        catch (error) {
            console.error('获取规格详情失败:', error);
            res.status(500).json({
                success: false,
                message: '获取规格详情失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createSpecification(req, res) {
        try {
            const { name, length, width, height, unit, resolution, description, isDefault, category } = req.body;
            const createdBy = req.user?.id || 'system';
            const specification = await SpecificationService_1.default.createSpecification({
                name,
                length,
                width,
                height,
                unit,
                resolution,
                description,
                isDefault,
                category,
                createdBy
            });
            res.status(201).json({
                success: true,
                data: specification,
                message: '规格创建成功'
            });
        }
        catch (error) {
            console.error('创建规格失败:', error);
            res.status(500).json({
                success: false,
                message: '创建规格失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateSpecification(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedBy = req.user?.id || 'system';
            const specification = await SpecificationService_1.default.updateSpecification(id, {
                ...updateData,
                updatedBy
            });
            if (!specification) {
                return res.status(404).json({
                    success: false,
                    message: '规格不存在'
                });
            }
            res.json({
                success: true,
                data: specification,
                message: '规格更新成功'
            });
        }
        catch (error) {
            console.error('更新规格失败:', error);
            res.status(500).json({
                success: false,
                message: '更新规格失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deleteSpecification(req, res) {
        try {
            const { id } = req.params;
            await SpecificationService_1.default.deleteSpecification(id);
            res.json({
                success: true,
                message: '规格删除成功'
            });
        }
        catch (error) {
            console.error('删除规格失败:', error);
            res.status(500).json({
                success: false,
                message: '删除规格失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getDefaultSpecifications(req, res) {
        try {
            const specifications = await SpecificationService_1.default.getDefaultSpecifications();
            res.json({
                success: true,
                data: specifications
            });
        }
        catch (error) {
            console.error('获取默认规格失败:', error);
            res.status(500).json({
                success: false,
                message: '获取默认规格失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async setDefaultSpecification(req, res) {
        try {
            const { id } = req.params;
            const { isDefault } = req.body;
            const updatedBy = req.user?.id || 'system';
            const specification = await SpecificationService_1.default.setDefaultSpecification(id, isDefault, updatedBy);
            if (!specification) {
                return res.status(404).json({
                    success: false,
                    message: '规格不存在'
                });
            }
            res.json({
                success: true,
                data: specification,
                message: isDefault ? '规格已设为默认' : '规格已取消默认'
            });
        }
        catch (error) {
            console.error('设置默认规格失败:', error);
            res.status(500).json({
                success: false,
                message: '设置默认规格失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.SpecificationController = SpecificationController;
//# sourceMappingURL=SpecificationController.js.map