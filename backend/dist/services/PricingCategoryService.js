"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingCategoryService = void 0;
const PricingCategory_1 = require("../models/PricingCategory");
class PricingCategoryService {
    static async getCategories() {
        try {
            const categories = await PricingCategory_1.PricingCategory.find().sort({ createTime: -1 });
            return categories.map(category => ({
                _id: category._id?.toString() || '',
                name: category.name,
                description: category.description,
                status: category.status,
                serviceCount: category.serviceCount,
                createTime: category.createTime.toLocaleDateString('zh-CN'),
                updateTime: category.updateTime.toLocaleDateString('zh-CN')
            }));
        }
        catch (error) {
            throw new Error('获取定价分类列表失败');
        }
    }
    static async getCategoryById(id) {
        try {
            const category = await PricingCategory_1.PricingCategory.findById(id);
            if (!category)
                return null;
            return {
                _id: category._id?.toString() || '',
                name: category.name,
                description: category.description,
                status: category.status,
                serviceCount: category.serviceCount,
                createTime: category.createTime.toLocaleDateString('zh-CN'),
                updateTime: category.updateTime.toLocaleDateString('zh-CN')
            };
        }
        catch (error) {
            throw new Error('获取定价分类详情失败');
        }
    }
    static async createCategory(data) {
        try {
            const existingCategory = await PricingCategory_1.PricingCategory.findOne({ name: data.name });
            if (existingCategory) {
                throw new Error('分类名称已存在');
            }
            const category = new PricingCategory_1.PricingCategory({
                name: data.name,
                description: data.description || '',
                status: data.status || 'active',
                serviceCount: 0
            });
            const savedCategory = await category.save();
            return {
                _id: savedCategory._id?.toString() || '',
                name: savedCategory.name,
                description: savedCategory.description,
                status: savedCategory.status,
                serviceCount: savedCategory.serviceCount,
                createTime: savedCategory.createTime.toLocaleDateString('zh-CN'),
                updateTime: savedCategory.updateTime.toLocaleDateString('zh-CN')
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('创建定价分类失败');
        }
    }
    static async updateCategory(id, data) {
        try {
            const existingCategory = await PricingCategory_1.PricingCategory.findById(id);
            if (!existingCategory) {
                return null;
            }
            if (data.name && data.name !== existingCategory.name) {
                const duplicateCategory = await PricingCategory_1.PricingCategory.findOne({ name: data.name });
                if (duplicateCategory) {
                    throw new Error('分类名称已存在');
                }
            }
            const updatedCategory = await PricingCategory_1.PricingCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
            if (!updatedCategory)
                return null;
            return {
                _id: updatedCategory._id?.toString() || '',
                name: updatedCategory.name,
                description: updatedCategory.description,
                status: updatedCategory.status,
                serviceCount: updatedCategory.serviceCount,
                createTime: updatedCategory.createTime.toLocaleDateString('zh-CN'),
                updateTime: updatedCategory.updateTime.toLocaleDateString('zh-CN')
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('更新定价分类失败');
        }
    }
    static async deleteCategory(id) {
        try {
            const result = await PricingCategory_1.PricingCategory.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error('删除定价分类失败');
        }
    }
    static async toggleCategoryStatus(id) {
        try {
            const category = await PricingCategory_1.PricingCategory.findById(id);
            if (!category)
                return null;
            const newStatus = category.status === 'active' ? 'inactive' : 'active';
            const updatedCategory = await PricingCategory_1.PricingCategory.findByIdAndUpdate(id, { status: newStatus }, { new: true });
            if (!updatedCategory)
                return null;
            return {
                _id: updatedCategory._id?.toString() || '',
                name: updatedCategory.name,
                description: updatedCategory.description,
                status: updatedCategory.status,
                serviceCount: updatedCategory.serviceCount,
                createTime: updatedCategory.createTime.toLocaleDateString('zh-CN'),
                updateTime: updatedCategory.updateTime.toLocaleDateString('zh-CN')
            };
        }
        catch (error) {
            throw new Error('切换定价分类状态失败');
        }
    }
    static async updateServiceCount(id, count) {
        try {
            await PricingCategory_1.PricingCategory.findByIdAndUpdate(id, { serviceCount: count });
        }
        catch (error) {
            throw new Error('更新服务数量失败');
        }
    }
    static async searchCategories(searchTerm) {
        try {
            const categories = await PricingCategory_1.PricingCategory.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            }).sort({ createTime: -1 });
            return categories.map(category => ({
                _id: category._id?.toString() || '',
                name: category.name,
                description: category.description,
                status: category.status,
                serviceCount: category.serviceCount,
                createTime: category.createTime.toLocaleDateString('zh-CN'),
                updateTime: category.updateTime.toLocaleDateString('zh-CN')
            }));
        }
        catch (error) {
            throw new Error('搜索定价分类失败');
        }
    }
}
exports.PricingCategoryService = PricingCategoryService;
//# sourceMappingURL=PricingCategoryService.js.map