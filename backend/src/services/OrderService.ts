import { Order, IOrder } from '../models/Order'
import { OrderVersionService } from './OrderVersionService'

export class OrderService {
    private orderVersionService = new OrderVersionService()

    /**
     * 创建订单
     */
    async createOrder(orderData: {
        clientId: string
        clientName: string
        contactIds: string[]
        contactNames: string[]
        contactPhones: string[]
        projectName: string
        quotationId?: string
        selectedServices: any[]
        serviceDetails: any[]
        policies: any[]
        createdBy: string
    }): Promise<IOrder> {
        const {
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
        } = orderData

        // 创建订单（不包含快照）
        const order = new Order({
            clientId,
            clientName,
            contactIds,
            contactNames,
            contactPhones,
            projectName,
            quotationId,
            createdBy,
            updatedBy: createdBy
        })

        const savedOrder = await order.save()

        // 创建第一个订单版本
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
            })
        } catch (error) {
            console.error('创建订单版本失败:', error)
            // 即使版本创建失败，也不影响订单创建
        }

        return savedOrder
    }

    /**
     * 更新订单基本信息
     */
    async updateOrder(orderId: string, updateData: {
        clientId?: string
        clientName?: string
        contactIds?: string[]
        contactNames?: string[]
        contactPhones?: string[]
        projectName?: string
        quotationId?: string
        status?: 'normal' | 'cancelled' | 'draft'
        paymentMethod?: string
        deliveryDate?: Date
        address?: string
        remark?: string
        selectedServices?: string[]
        serviceDetails?: any[]
        policies?: any[]
        updatedBy: string
    }): Promise<IOrder> {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('订单不存在')
        }

        // 更新订单基本信息（排除服务相关字段）
        const { selectedServices, serviceDetails, policies, ...basicUpdateData } = updateData
        Object.assign(order, basicUpdateData)
        order.updateTime = new Date()

        const updatedOrder = await order.save()

        // 如果更新包含服务详情，创建新的订单版本
        if (serviceDetails && serviceDetails.length > 0) {
            console.log('检测到服务详情变更，创建新订单版本...')

            try {
                await this.orderVersionService.createOrderVersion({
                    orderId: orderId,
                    clientId: updateData.clientId || order.clientId,
                    clientName: updateData.clientName || order.clientName,
                    contactIds: updateData.contactIds || order.contactIds,
                    contactNames: updateData.contactNames || order.contactNames,
                    contactPhones: updateData.contactPhones || order.contactPhones,
                    projectName: updateData.projectName || order.projectName,
                    quotationId: updateData.quotationId || order.quotationId,
                    selectedServices: selectedServices || [],
                    serviceDetails: serviceDetails,
                    policies: policies || [],
                    createdBy: updateData.updatedBy
                })

                console.log('订单版本创建成功')
            } catch (versionError) {
                console.error('创建订单版本失败:', versionError)
                // 不抛出错误，以免影响订单基本信息的更新
            }
        }

        return updatedOrder
    }

    /**
     * 获取订单列表
     */
    async getOrders(params: {
        page?: number
        limit?: number
        search?: string
        status?: string
        clientId?: string
    }): Promise<{ orders: IOrder[], total: number }> {
        const { page = 1, limit = 10, search = '', status = '', clientId = '' } = params

        // 构建查询条件
        const query: any = {}

        if (search) {
            query.$or = [
                { orderNo: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } }
            ]
        }

        if (status) {
            query.status = status
        }

        if (clientId) {
            query.clientId = clientId
        }

        // 执行查询
        const skip = (page - 1) * limit
        const orders = await Order.find(query)
            .sort({ createTime: -1 })
            .skip(skip)
            .limit(limit)
            .exec()

        const total = await Order.countDocuments(query)

        // 为每个订单获取最新版本信息
        const ordersWithLatestVersion = await Promise.all(
            orders.map(async (order) => {
                try {
                    const latestVersion = await this.orderVersionService.getLatestOrderVersion(order._id?.toString() || '')
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
                        } as any
                    }
                } catch (error) {
                    console.error(`获取订单 ${order._id} 最新版本失败:`, error)
                }
                return order.toObject() as any
            })
        )

        return { orders: ordersWithLatestVersion, total }
    }

    /**
     * 根据ID获取订单
     */
    async getOrderById(orderId: string): Promise<IOrder | null> {
        const order = await Order.findById(orderId)
        if (!order) {
            return null
        }

        // 获取最新版本信息
        try {
            const latestVersion = await this.orderVersionService.getLatestOrderVersion(orderId)
            if (latestVersion) {
                const orderObj = order.toObject()
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
                } as any
            }
        } catch (error) {
            console.error(`获取订单 ${orderId} 最新版本失败:`, error)
        }

        return order
    }

    /**
     * 获取订单版本历史
     */
    async getOrderVersionHistory(orderId: string): Promise<any[]> {
        try {
            const versions = await this.orderVersionService.getOrderVersions(orderId)
            return versions.map(version => ({
                versionNumber: version.versionNumber,
                createdAt: version.createdAt,
                createdBy: version.createdBy,
                totalAmount: version.totalAmount,
                totalItems: version.calculationSummary?.totalItems || 0
            }))
        } catch (error) {
            console.error('获取订单版本历史失败:', error)
            return []
        }
    }

    /**
     * 获取订单快照（从订单版本表获取）
     */
    async getOrderSnapshot(orderId: string, versionNumber: number): Promise<any | null> {
        try {
            const version = await this.orderVersionService.getOrderVersion(orderId, versionNumber)
            if (!version) {
                return null
            }

            // 转换为快照格式
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
            }
        } catch (error) {
            console.error('获取订单快照失败:', error)
            return null
        }
    }

    /**
     * 更新订单状态
     */
    async updateOrderStatus(orderId: string, status: 'normal' | 'cancelled' | 'draft', updatedBy: string): Promise<IOrder> {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('订单不存在')
        }

        order.status = status
        order.updatedBy = updatedBy
        order.updateTime = new Date()

        return await order.save()
    }

    /**
     * 删除订单
     */
    async deleteOrder(orderId: string): Promise<void> {
        // 删除订单版本
        try {
            await this.orderVersionService.deleteOrderVersions(orderId)
        } catch (error) {
            console.error('删除订单版本失败:', error)
        }

        // 删除订单
        await Order.findByIdAndDelete(orderId)
    }
} 