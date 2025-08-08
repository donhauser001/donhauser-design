"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationController = void 0;
const QuotationService_1 = __importDefault(require("../services/QuotationService"));
class QuotationController {
    async getAllQuotations(req, res) {
        try {
            const quotations = await QuotationService_1.default.getAllQuotations();
            res.json({
                success: true,
                data: quotations
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取报价单列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getQuotationById(req, res) {
        try {
            const { id } = req.params;
            const quotation = await QuotationService_1.default.getQuotationById(id);
            if (!quotation) {
                return res.status(404).json({
                    success: false,
                    message: '报价单不存在'
                });
            }
            res.json({
                success: true,
                data: quotation
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取报价单详情失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createQuotation(req, res) {
        try {
            const { name, description, isDefault, selectedServices, validUntil } = req.body;
            if (!name || !selectedServices || selectedServices.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: '报价单名称和选择的服务项目不能为空'
                });
            }
            const quotation = await QuotationService_1.default.createQuotation({
                name,
                description: description || '',
                isDefault: isDefault || false,
                selectedServices,
                validUntil: validUntil ? new Date(validUntil) : undefined
            });
            res.status(201).json({
                success: true,
                data: quotation,
                message: '报价单创建成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '创建报价单失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateQuotation(req, res) {
        try {
            const { id } = req.params;
            const { name, description, isDefault, selectedServices, validUntil } = req.body;
            if (!name || !selectedServices || selectedServices.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: '报价单名称和选择的服务项目不能为空'
                });
            }
            const quotation = await QuotationService_1.default.updateQuotation(id, {
                name,
                description: description || '',
                isDefault: isDefault || false,
                selectedServices,
                validUntil: validUntil ? new Date(validUntil) : undefined
            });
            if (!quotation) {
                return res.status(404).json({
                    success: false,
                    message: '报价单不存在'
                });
            }
            res.json({
                success: true,
                data: quotation,
                message: '报价单更新成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '更新报价单失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deleteQuotation(req, res) {
        try {
            const { id } = req.params;
            const success = await QuotationService_1.default.deleteQuotation(id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: '报价单不存在'
                });
            }
            res.json({
                success: true,
                message: '报价单删除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '删除报价单失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async toggleQuotationStatus(req, res) {
        try {
            const { id } = req.params;
            const quotation = await QuotationService_1.default.toggleQuotationStatus(id);
            if (!quotation) {
                return res.status(404).json({
                    success: false,
                    message: '报价单不存在'
                });
            }
            res.json({
                success: true,
                data: quotation,
                message: '状态切换成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '切换状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async searchQuotations(req, res) {
        try {
            const { q } = req.query;
            const searchText = typeof q === 'string' ? q : '';
            if (!searchText.trim()) {
                return res.status(400).json({
                    success: false,
                    message: '搜索关键词不能为空'
                });
            }
            const quotations = await QuotationService_1.default.searchQuotations(searchText);
            res.json({
                success: true,
                data: quotations
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '搜索报价单失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getQuotationsByClientId(req, res) {
        try {
            const { clientId } = req.params;
            const Client = require('../models/Client').default;
            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: '客户不存在'
                });
            }
            if (client.quotationId) {
                const quotation = await QuotationService_1.default.getQuotationById(client.quotationId);
                if (quotation) {
                    return res.json({
                        success: true,
                        data: [quotation]
                    });
                }
            }
            res.json({
                success: true,
                data: []
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取客户关联报价单失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.QuotationController = QuotationController;
exports.default = new QuotationController();
//# sourceMappingURL=QuotationController.js.map