"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePricingController = void 0;
const ServicePricingService_1 = require("../services/ServicePricingService");
class ServicePricingController {
    static async getAllServicePricing(req, res) {
        try {
            const servicePricing = await ServicePricingService_1.ServicePricingService.getAllServicePricing();
            res.json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '获取服务定价列表失败'
            });
        }
    }
    static async getServicePricingById(req, res) {
        try {
            const { id } = req.params;
            const servicePricing = await ServicePricingService_1.ServicePricingService.getServicePricingById(id);
            if (!servicePricing) {
                return res.status(404).json({
                    success: false,
                    error: '服务定价不存在'
                });
            }
            res.json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '获取服务定价详情失败'
            });
        }
    }
    static async getServicePricingByIds(req, res) {
        try {
            const { ids } = req.query;
            if (!ids || typeof ids !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: '请提供有效的ID列表'
                });
            }
            const idList = ids.split(',').filter(id => id.trim());
            if (idList.length === 0) {
                return res.json({
                    success: true,
                    data: []
                });
            }
            const servicePricing = await ServicePricingService_1.ServicePricingService.getServicePricingByIds(idList);
            res.json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '获取服务定价列表失败'
            });
        }
    }
    static async createServicePricing(req, res) {
        try {
            const servicePricingData = req.body;
            const servicePricing = await ServicePricingService_1.ServicePricingService.createServicePricing(servicePricingData);
            res.status(201).json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '创建服务定价失败'
            });
        }
    }
    static async updateServicePricing(req, res) {
        try {
            const { id } = req.params;
            const servicePricingData = req.body;
            const servicePricing = await ServicePricingService_1.ServicePricingService.updateServicePricing(id, servicePricingData);
            if (!servicePricing) {
                return res.status(404).json({
                    success: false,
                    error: '服务定价不存在'
                });
            }
            res.json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '更新服务定价失败'
            });
        }
    }
    static async toggleServicePricingStatus(req, res) {
        try {
            const { id } = req.params;
            const servicePricing = await ServicePricingService_1.ServicePricingService.toggleServicePricingStatus(id);
            if (!servicePricing) {
                return res.status(404).json({
                    success: false,
                    error: '服务定价不存在'
                });
            }
            res.json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '切换服务定价状态失败'
            });
        }
    }
    static async deleteServicePricing(req, res) {
        try {
            const { id } = req.params;
            await ServicePricingService_1.ServicePricingService.deleteServicePricing(id);
            res.json({
                success: true,
                message: '服务定价删除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '删除服务定价失败'
            });
        }
    }
    static async searchServicePricing(req, res) {
        try {
            const { search } = req.query;
            if (!search || typeof search !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: '搜索关键词不能为空'
                });
            }
            const servicePricing = await ServicePricingService_1.ServicePricingService.searchServicePricing(search);
            res.json({
                success: true,
                data: servicePricing
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '搜索服务定价失败'
            });
        }
    }
}
exports.ServicePricingController = ServicePricingController;
//# sourceMappingURL=ServicePricingController.js.map