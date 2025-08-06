"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderVersionController = void 0;
const OrderVersionService_1 = require("../services/OrderVersionService");
const orderVersionService = new OrderVersionService_1.OrderVersionService();
class OrderVersionController {
    async createOrderVersion(req, res) {
        try {
            const { orderId, clientId, clientName, contactIds, contactNames, contactPhones, projectName, quotationId, selectedServices, serviceDetails, policies } = req.body;
            const createdBy = req.user?.id || 'system';
            const orderVersion = await orderVersionService.createOrderVersion({
                orderId,
                clientId,
                clientName,
                contactIds,
                contactNames,
                contactPhones,
                projectName,
                quotationId,
                selectedServices,
                serviceDetails,
                policies,
                createdBy
            });
            res.status(201).json({
                success: true,
                message: '订单版本创建成功',
                data: orderVersion
            });
        }
        catch (error) {
            console.error('创建订单版本失败:', error);
            res.status(500).json({
                success: false,
                message: '创建订单版本失败',
                error: error.message
            });
        }
    }
    async getOrderVersions(req, res) {
        try {
            const { orderId } = req.params;
            const versions = await orderVersionService.getOrderVersions(orderId);
            res.json({
                success: true,
                message: '获取订单版本成功',
                data: versions
            });
        }
        catch (error) {
            console.error('获取订单版本失败:', error);
            res.status(500).json({
                success: false,
                message: '获取订单版本失败',
                error: error.message
            });
        }
    }
    async getOrderVersion(req, res) {
        try {
            const { orderId, versionNumber } = req.params;
            const version = await orderVersionService.getOrderVersion(orderId, parseInt(versionNumber));
            if (!version) {
                return res.status(404).json({
                    success: false,
                    message: '订单版本不存在'
                });
            }
            res.json({
                success: true,
                message: '获取订单版本成功',
                data: version
            });
        }
        catch (error) {
            console.error('获取订单版本失败:', error);
            res.status(500).json({
                success: false,
                message: '获取订单版本失败',
                error: error.message
            });
        }
    }
    async getLatestOrderVersion(req, res) {
        try {
            const { orderId } = req.params;
            const version = await orderVersionService.getLatestOrderVersion(orderId);
            if (!version) {
                return res.status(404).json({
                    success: false,
                    message: '订单版本不存在'
                });
            }
            res.json({
                success: true,
                message: '获取最新订单版本成功',
                data: version
            });
        }
        catch (error) {
            console.error('获取最新订单版本失败:', error);
            res.status(500).json({
                success: false,
                message: '获取最新订单版本失败',
                error: error.message
            });
        }
    }
    async deleteOrderVersions(req, res) {
        try {
            const { orderId } = req.params;
            await orderVersionService.deleteOrderVersions(orderId);
            res.json({
                success: true,
                message: '删除订单版本成功'
            });
        }
        catch (error) {
            console.error('删除订单版本失败:', error);
            res.status(500).json({
                success: false,
                message: '删除订单版本失败',
                error: error.message
            });
        }
    }
}
exports.OrderVersionController = OrderVersionController;
//# sourceMappingURL=OrderVersionController.js.map