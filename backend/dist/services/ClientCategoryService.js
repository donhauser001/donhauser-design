"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCategoryService = void 0;
const uuid_1 = require("uuid");
let categories = [
    {
        id: (0, uuid_1.v4)(),
        name: 'VIP客户',
        description: '高价值客户，享受优先服务',
        status: 'active',
        clientCount: 12,
        createTime: '2024-01-01'
    },
    {
        id: (0, uuid_1.v4)(),
        name: '普通客户',
        description: '常规客户，标准服务流程',
        status: 'active',
        clientCount: 45,
        createTime: '2024-01-01'
    },
    {
        id: (0, uuid_1.v4)(),
        name: '潜在客户',
        description: '有合作意向的潜在客户',
        status: 'active',
        clientCount: 23,
        createTime: '2024-01-01'
    },
    {
        id: (0, uuid_1.v4)(),
        name: '流失客户',
        description: '已停止合作的客户',
        status: 'inactive',
        clientCount: 8,
        createTime: '2024-01-01'
    }
];
class ClientCategoryService {
    getCategories() {
        return categories;
    }
    getCategoryById(id) {
        return categories.find(c => c.id === id);
    }
    createCategory(data) {
        if (categories.some(c => c.name === data.name)) {
            throw new Error('分类名称已存在');
        }
        const newCategory = {
            id: (0, uuid_1.v4)(),
            name: data.name,
            description: data.description || '',
            status: data.status || 'active',
            clientCount: 0,
            createTime: new Date().toISOString().slice(0, 10)
        };
        categories.unshift(newCategory);
        return newCategory;
    }
    updateCategory(id, data) {
        const idx = categories.findIndex(c => c.id === id);
        if (idx === -1)
            return null;
        if (data.name && categories.some(c => c.name === data.name && c.id !== id)) {
            throw new Error('分类名称已存在');
        }
        categories[idx] = { ...categories[idx], ...data };
        return categories[idx];
    }
    deleteCategory(id) {
        const idx = categories.findIndex(c => c.id === id);
        if (idx === -1)
            return false;
        categories.splice(idx, 1);
        return true;
    }
}
exports.ClientCategoryService = ClientCategoryService;
//# sourceMappingURL=ClientCategoryService.js.map