"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContractElementService_1 = __importDefault(require("../services/ContractElementService"));
class ContractElementController {
    async getList(req, res) {
        try {
            const { page, limit, search, type, status } = req.query;
            const result = await ContractElementService_1.default.getList({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 100,
                search: search,
                type: type,
                status: status
            });
            res.json({
                success: true,
                data: result.elements,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    pages: Math.ceil(result.total / result.limit)
                }
            });
        }
        catch (error) {
            console.error('获取合同元素列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取合同元素列表失败'
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const element = await ContractElementService_1.default.getById(id);
            if (!element) {
                return res.status(404).json({
                    success: false,
                    message: '合同元素不存在'
                });
            }
            res.json({
                success: true,
                data: element
            });
        }
        catch (error) {
            console.error('获取合同元素失败:', error);
            res.status(500).json({
                success: false,
                message: '获取合同元素失败'
            });
        }
    }
    async create(req, res) {
        try {
            const { name, type, description, status } = req.body;
            if (!name || !type) {
                return res.status(400).json({
                    success: false,
                    message: '元素名称和类型为必填项'
                });
            }
            const nameExists = await ContractElementService_1.default.isNameExists(name);
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: '元素名称已存在'
                });
            }
            const element = await ContractElementService_1.default.create({
                name,
                type,
                description,
                status: status || 'active',
                createdBy: req.user?.username || 'system'
            });
            const formattedElement = element.toObject();
            formattedElement.createTime = element.createTime;
            formattedElement.updateTime = element.updateTime;
            res.status(201).json({
                success: true,
                data: formattedElement,
                message: '合同元素创建成功'
            });
        }
        catch (error) {
            console.error('创建合同元素失败:', error);
            res.status(500).json({
                success: false,
                message: '创建合同元素失败'
            });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, type, description, status } = req.body;
            const existingElement = await ContractElementService_1.default.getById(id);
            if (!existingElement) {
                return res.status(404).json({
                    success: false,
                    message: '合同元素不存在'
                });
            }
            if (name && name !== existingElement.name) {
                const nameExists = await ContractElementService_1.default.isNameExists(name, id);
                if (nameExists) {
                    return res.status(400).json({
                        success: false,
                        message: '元素名称已存在'
                    });
                }
            }
            const updatedElement = await ContractElementService_1.default.update(id, {
                name,
                type,
                description,
                status
            });
            const formattedElement = updatedElement?.toObject();
            if (formattedElement) {
                formattedElement.createTime = updatedElement.createTime;
                formattedElement.updateTime = updatedElement.updateTime;
            }
            res.json({
                success: true,
                data: formattedElement,
                message: '合同元素更新成功'
            });
        }
        catch (error) {
            console.error('更新合同元素失败:', error);
            res.status(500).json({
                success: false,
                message: '更新合同元素失败'
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const existingElement = await ContractElementService_1.default.getById(id);
            if (!existingElement) {
                return res.status(404).json({
                    success: false,
                    message: '合同元素不存在'
                });
            }
            const deleted = await ContractElementService_1.default.delete(id);
            if (deleted) {
                res.json({
                    success: true,
                    message: '合同元素删除成功'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '删除失败'
                });
            }
        }
        catch (error) {
            console.error('删除合同元素失败:', error);
            res.status(500).json({
                success: false,
                message: '删除合同元素失败'
            });
        }
    }
    async getActiveElements(req, res) {
        try {
            const elements = await ContractElementService_1.default.getActiveElements();
            res.json({
                success: true,
                data: elements
            });
        }
        catch (error) {
            console.error('获取启用合同元素失败:', error);
            res.status(500).json({
                success: false,
                message: '获取启用合同元素失败'
            });
        }
    }
}
exports.default = new ContractElementController();
//# sourceMappingURL=ContractElementController.js.map