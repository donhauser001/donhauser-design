"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderVersionService_1 = require("../services/OrderVersionService");
const OrderService_1 = require("../services/OrderService");
const orderVersionService = new OrderVersionService_1.OrderVersionService();
const orderService = new OrderService_1.OrderService();
async function testOrderVersion() {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/donhauser');
        console.log('数据库连接成功');
        const mockOrderData = {
            clientId: 'test-client-id',
            clientName: '测试客户',
            contactIds: ['contact1', 'contact2'],
            contactNames: ['联系人1', '联系人2'],
            contactPhones: ['13800138001', '13800138002'],
            projectName: '测试项目',
            quotationId: 'test-quotation-id',
            selectedServices: ['service1', 'service2'],
            serviceDetails: [
                {
                    _id: 'service1',
                    serviceName: '服务项目1',
                    categoryName: '分类1',
                    unitPrice: 100,
                    unit: '项',
                    quantity: 2
                },
                {
                    _id: 'service2',
                    serviceName: '服务项目2',
                    categoryName: '分类2',
                    unitPrice: 200,
                    unit: '项',
                    quantity: 1
                }
            ],
            policies: [
                {
                    serviceId: 'service1',
                    policyId: 'policy1',
                    name: '政策1',
                    type: 'uniform_discount',
                    discountRatio: 0.8
                }
            ],
            createdBy: 'test-user'
        };
        console.log('=== 测试创建订单版本 ===');
        const orderVersion = await orderVersionService.createOrderVersion({
            orderId: 'test-order-id',
            ...mockOrderData
        });
        console.log('创建的订单版本:', {
            orderId: orderVersion.orderId,
            versionNumber: orderVersion.versionNumber,
            iterationTime: orderVersion.iterationTime,
            totalAmount: orderVersion.totalAmount,
            totalItems: orderVersion.calculationSummary.totalItems
        });
        console.log('\n=== 测试获取订单版本 ===');
        const versions = await orderVersionService.getOrderVersions('test-order-id');
        console.log('订单版本列表:', versions.map(v => ({
            versionNumber: v.versionNumber,
            totalAmount: v.totalAmount,
            totalItems: v.calculationSummary.totalItems
        })));
        console.log('\n=== 测试获取特定版本 ===');
        const specificVersion = await orderVersionService.getOrderVersion('test-order-id', 1);
        console.log('特定版本:', specificVersion ? {
            versionNumber: specificVersion.versionNumber,
            totalAmount: specificVersion.totalAmount
        } : '未找到');
        console.log('\n=== 测试获取最新版本 ===');
        const latestVersion = await orderVersionService.getLatestOrderVersion('test-order-id');
        console.log('最新版本:', latestVersion ? {
            versionNumber: latestVersion.versionNumber,
            totalAmount: latestVersion.totalAmount
        } : '未找到');
        console.log('\n=== 测试完成 ===');
    }
    catch (error) {
        console.error('测试失败:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('数据库连接已关闭');
    }
}
testOrderVersion();
//# sourceMappingURL=testOrderVersion.js.map