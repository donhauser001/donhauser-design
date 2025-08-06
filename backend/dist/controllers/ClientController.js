"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const ClientService_1 = require("../services/ClientService");
class ClientController {
    static async getClients(req, res) {
        try {
            const query = {
                search: req.query.search,
                status: req.query.status,
                category: req.query.category,
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined
            };
            const result = await ClientService_1.ClientService.getClients(query);
            res.json({
                success: true,
                message: '获取客户列表成功',
                data: result.data,
                total: result.total
            });
        }
        catch (error) {
            console.error('获取客户列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取客户列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async getClientById(req, res) {
        try {
            const { id } = req.params;
            const client = await ClientService_1.ClientService.getClientById(id);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: '客户不存在'
                });
            }
            res.json({
                success: true,
                message: '获取客户信息成功',
                data: client
            });
        }
        catch (error) {
            console.error('获取客户信息失败:', error);
            res.status(500).json({
                success: false,
                message: '获取客户信息失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async createClient(req, res) {
        try {
            const clientData = req.body;
            if (!clientData.name || !clientData.address || !clientData.invoiceType || !clientData.category) {
                return res.status(400).json({
                    success: false,
                    message: '缺少必填字段'
                });
            }
            const newClient = await ClientService_1.ClientService.createClient(clientData);
            res.status(201).json({
                success: true,
                message: '客户创建成功',
                data: newClient
            });
        }
        catch (error) {
            console.error('创建客户失败:', error);
            res.status(500).json({
                success: false,
                message: '创建客户失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async updateClient(req, res) {
        try {
            const { id } = req.params;
            const clientData = req.body;
            const updatedClient = await ClientService_1.ClientService.updateClient(id, clientData);
            if (!updatedClient) {
                return res.status(404).json({
                    success: false,
                    message: '客户不存在'
                });
            }
            res.json({
                success: true,
                message: '客户信息更新成功',
                data: updatedClient
            });
        }
        catch (error) {
            console.error('更新客户失败:', error);
            res.status(500).json({
                success: false,
                message: '更新客户失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async deleteClient(req, res) {
        try {
            const { id } = req.params;
            const success = await ClientService_1.ClientService.deleteClient(id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: '客户不存在'
                });
            }
            res.json({
                success: true,
                message: '客户删除成功'
            });
        }
        catch (error) {
            console.error('删除客户失败:', error);
            res.status(500).json({
                success: false,
                message: '删除客户失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async addClientFile(req, res) {
        try {
            const { clientId } = req.params;
            const { filePath, originalName, size } = req.body;
            if (!filePath || !originalName || size === undefined) {
                return res.status(400).json({
                    success: false,
                    message: '文件信息不完整'
                });
            }
            const fileInfo = {
                path: filePath,
                originalName: originalName,
                size: size
            };
            const success = await ClientService_1.ClientService.addClientFile(clientId, fileInfo);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: '客户不存在'
                });
            }
            res.json({
                success: true,
                message: '文件添加成功'
            });
        }
        catch (error) {
            console.error('添加客户文件失败:', error);
            res.status(500).json({
                success: false,
                message: '添加客户文件失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    static async removeClientFile(req, res) {
        try {
            const { clientId } = req.params;
            const { filePath } = req.body;
            if (!filePath) {
                return res.status(400).json({
                    success: false,
                    message: '文件路径不能为空'
                });
            }
            const success = await ClientService_1.ClientService.removeClientFile(clientId, filePath);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: '客户或文件不存在'
                });
            }
            res.json({
                success: true,
                message: '文件删除成功'
            });
        }
        catch (error) {
            console.error('删除客户文件失败:', error);
            res.status(500).json({
                success: false,
                message: '删除客户文件失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.ClientController = ClientController;
//# sourceMappingURL=ClientController.js.map