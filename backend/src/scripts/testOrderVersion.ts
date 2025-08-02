import mongoose from 'mongoose'
import { OrderVersionService } from '../services/OrderVersionService'
import { OrderService } from '../services/OrderService'

const orderVersionService = new OrderVersionService()
const orderService = new OrderService()

async function testOrderVersion() {
    try {
        // 连接数据库
        await mongoose.connect('mongodb://localhost:27017/donhauser')
        console.log('数据库连接成功')

        // 模拟订单数据
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
        }

        // 测试创建订单版本
        console.log('=== 测试创建订单版本 ===')
        const orderVersion = await orderVersionService.createOrderVersion({
            orderId: 'test-order-id',
            ...mockOrderData
        })
        console.log('创建的订单版本:', {
            orderId: orderVersion.orderId,
            versionNumber: orderVersion.versionNumber,
            iterationTime: orderVersion.iterationTime,
            totalAmount: orderVersion.totalAmount,
            totalItems: orderVersion.calculationSummary.totalItems
        })

        // 测试获取订单版本
        console.log('\n=== 测试获取订单版本 ===')
        const versions = await orderVersionService.getOrderVersions('test-order-id')
        console.log('订单版本列表:', versions.map(v => ({
            versionNumber: v.versionNumber,
            totalAmount: v.totalAmount,
            totalItems: v.calculationSummary.totalItems
        })))

        // 测试获取特定版本
        console.log('\n=== 测试获取特定版本 ===')
        const specificVersion = await orderVersionService.getOrderVersion('test-order-id', 1)
        console.log('特定版本:', specificVersion ? {
            versionNumber: specificVersion.versionNumber,
            totalAmount: specificVersion.totalAmount
        } : '未找到')

        // 测试获取最新版本
        console.log('\n=== 测试获取最新版本 ===')
        const latestVersion = await orderVersionService.getLatestOrderVersion('test-order-id')
        console.log('最新版本:', latestVersion ? {
            versionNumber: latestVersion.versionNumber,
            totalAmount: latestVersion.totalAmount
        } : '未找到')

        console.log('\n=== 测试完成 ===')

    } catch (error) {
        console.error('测试失败:', error)
    } finally {
        await mongoose.disconnect()
        console.log('数据库连接已关闭')
    }
}

// 运行测试
testOrderVersion() 