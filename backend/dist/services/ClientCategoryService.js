"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCategoryService = void 0;
const ClientCategory_1 = __importDefault(require("../models/ClientCategory"));
class ClientCategoryService {
    static async getCategories() {
        try {
            return await ClientCategory_1.default.find().sort({ createTime: -1 });
        }
        catch (error) {
            console.error('获取客户分类失败:', error);
            throw error;
        }
    }
    static async getCategoryById(id) {
        try {
            return await ClientCategory_1.default.findById(id);
        }
        catch (error) {
            console.error('获取客户分类失败:', error);
            throw error;
        }
    }
    static async createCategory(data) {
        try {
            const existingCategory = await ClientCategory_1.default.findOne({ name: data.name });
            if (existingCategory) {
                throw new Error('分类名称已存在');
            }
            const newCategory = new ClientCategory_1.default({
                ...data,
                createTime: new Date().toISOString().slice(0, 10)
            });
            return await newCategory.save();
        }
        catch (error) {
            console.error('创建客户分类失败:', error);
            throw error;
        }
    }
    static async updateCategory(id, data) {
        try {
            if (data.name) {
                const existingCategory = await ClientCategory_1.default.findOne({
                    name: data.name,
                    _id: { $ne: id }
                });
                if (existingCategory) {
                    throw new Error('分类名称已存在');
                }
            }
            const updatedCategory = await ClientCategory_1.default.findByIdAndUpdate(id, data, { new: true });
            return updatedCategory;
        }
        catch (error) {
            console.error('更新客户分类失败:', error);
            throw error;
        }
    }
    static async deleteCategory(id) {
        try {
            const result = await ClientCategory_1.default.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            console.error('删除客户分类失败:', error);
            throw error;
        }
    }
}
exports.ClientCategoryService = ClientCategoryService;
//# sourceMappingURL=ClientCategoryService.js.map