"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = require("../models/Order");
const OrderVersionService_1 = require("./OrderVersionService");
class OrderService {
    constructor() {
        this.orderVersionService = new OrderVersionService_1.OrderVersionService();
    }
    async createOrder(orderData) {
        const { clientId, clientName, contactIds, contactNames, contactPhones, projectName, quotationId, selectedServices, serviceDetails, policies, createdBy } = orderData;
        const order = new Order_1.Order({
            clientId,
            clientName,
            contactIds,
            contactNames,
            contactPhones,
            projectName,
            quotationId,
            createdBy,
            updatedBy: createdBy
        });
        const savedOrder = await order.save();
        try {
            await this.orderVersionService.createOrderVersion({
                orderId: savedOrder._id?.toString() || '',
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
        }
        catch (error) {
            console.error('创建订单版本失败:', error);
        }
        return savedOrder;
    }
    async updateOrder(orderId, updateData) {
        const order = await Order_1.Order.findById(orderId);
        if (!order) {
            throw new Error('订单不存在');
        }
        Object.assign(order, updateData);
        order.updateTime = new Date();
        return await order.save();
    }
    async getOrders(params) {
        const { page = 1, limit = 10, search = '', status = '', clientId = '' } = params;
        const query = {};
        if (search) {
            query.$or = [
                { orderNo: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) {
            query.status = status;
        }
        if (clientId) {
            query.clientId = clientId;
        }
        const skip = (page - 1) * limit;
        const orders = await Order_1.Order.find(query)
            .sort({ createTime: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await Order_1.Order.countDocuments(query);
        const ordersWithLatestVersion = await Promise.all(orders.map(async (order) => {
            try {
                const latestVersion = await this.orderVersionService.getLatestOrderVersion(order._id?.toString() || '');
                if (latestVersion) {
                    return {
                        ...order.toObject(),
                        currentVersion: latestVersion.versionNumber,
                        currentAmount: latestVersion.totalAmount,
                        currentAmountRMB: latestVersion.totalAmountRMB,
                        latestVersionInfo: {
                            versionNumber: latestVersion.versionNumber,
                            totalAmount: latestVersion.totalAmount,
                            totalItems: latestVersion.calculationSummary?.totalItems || 0
                        }
                    };
                }
            }
            catch (error) {
                console.error(`获取订单 ${order._id} 最新版本失败:`, error);
            }
            return order.toObject();
        }));
        return { orders: ordersWithLatestVersion, total };
    }
    async getOrderById(orderId) {
        const order = await Order_1.Order.findById(orderId);
        if (!order) {
            return null;
        }
        try {
            const latestVersion = await this.orderVersionService.getLatestOrderVersion(orderId);
            if (latestVersion) {
                const orderObj = order.toObject();
                return {
                    ...orderObj,
                    currentVersion: latestVersion.versionNumber,
                    currentAmount: latestVersion.totalAmount,
                    currentAmountRMB: latestVersion.totalAmountRMB,
                    latestVersionInfo: {
                        versionNumber: latestVersion.versionNumber,
                        totalAmount: latestVersion.totalAmount,
                        totalItems: latestVersion.calculationSummary?.totalItems || 0
                    }
                };
            }
        }
        catch (error) {
            console.error(`获取订单 ${orderId} 最新版本失败:`, error);
        }
        return order;
    }
    async getOrderVersionHistory(orderId) {
        try {
            const versions = await this.orderVersionService.getOrderVersions(orderId);
            return versions.map(version => ({
                versionNumber: version.versionNumber,
                createdAt: version.createdAt,
                createdBy: version.createdBy,
                totalAmount: version.totalAmount,
                totalItems: version.calculationSummary?.totalItems || 0
            }));
        }
        catch (error) {
            console.error('获取订单版本历史失败:', error);
            return [];
        }
    }
    async getOrderSnapshot(orderId, versionNumber) {
        try {
            const version = await this.orderVersionService.getOrderVersion(orderId, versionNumber);
            if (!version) {
                return null;
            }
            return {
                version: version.versionNumber,
                createdAt: version.createdAt,
                updatedBy: version.createdBy,
                clientInfo: {
                    clientId: version.clientId,
                    clientName: version.clientName,
                    contactIds: version.contactIds,
                    contactNames: version.contactNames,
                    contactPhones: version.contactPhones
                },
                projectInfo: {
                    projectName: version.projectName,
                    quotationId: version.quotationId
                },
                items: version.items,
                totalAmount: version.totalAmount,
                totalAmountRMB: version.totalAmountRMB,
                calculationSummary: version.calculationSummary
            };
        }
        catch (error) {
            console.error('获取订单快照失败:', error);
            return null;
        }
    }
    async updateOrderStatus(orderId, status, updatedBy) {
        const order = await Order_1.Order.findById(orderId);
        if (!order) {
            throw new Error('订单不存在');
        }
        order.status = status;
        order.updatedBy = updatedBy;
        order.updateTime = new Date();
        return await order.save();
    }
    async deleteOrder(orderId) {
        try {
            await this.orderVersionService.deleteOrderVersions(orderId);
        }
        catch (error) {
            console.error('删除订单版本失败:', error);
        }
        await Order_1.Order.findByIdAndDelete(orderId);
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map