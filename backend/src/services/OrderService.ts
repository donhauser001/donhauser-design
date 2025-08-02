import { Order, IOrder, IOrderSnapshot, IOrderItemSnapshot } from '../models/Order'
import { OrderVersionService } from './OrderVersionService'
import { convertToRMB } from '../utils/rmbConverter'
import { calculatePriceWithPolicies } from '../utils/pricePolicyCalculator'

export class OrderService {
    private orderVersionService = new OrderVersionService()

    /**
     * 创建订单（包含初始快照）
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

        // 生成初始快照
        const initialSnapshot = this.generateSnapshot({
            version: 1,
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
            updatedBy: createdBy
        })

        // 创建订单
        const order = new Order({
            clientId,
            clientName,
            contactIds,
            contactNames,
            contactPhones,
            projectName,
            quotationId,
            currentVersion: 1,
            currentAmount: initialSnapshot.totalAmount,
            currentAmountRMB: initialSnapshot.totalAmountRMB,
            snapshots: [initialSnapshot],
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
     * 更新订单（添加新快照）
     */
    async updateOrder(orderId: string, updateData: {
        clientId?: string
        clientName?: string
        contactIds?: string[]
        contactNames?: string[]
        contactPhones?: string[]
        projectName?: string
        quotationId?: string
        selectedServices?: any[]
        serviceDetails?: any[]
        policies?: any[]
        updatedBy: string
        // 版本管理相关参数
        shouldCreateNewSnapshot?: boolean
        currentSnapshotIndex?: number
    }): Promise<IOrder> {
        console.log('OrderService.updateOrder 开始执行:', { orderId, updateData })

        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('订单不存在')
        }

        console.log('找到订单:', order.orderNo)

        // 更新订单基本信息（第一步和第二步的数据）
        Object.assign(order, {
            clientId: updateData.clientId || order.clientId,
            clientName: updateData.clientName || order.clientName,
            contactIds: updateData.contactIds || order.contactIds,
            contactNames: updateData.contactNames || order.contactNames,
            contactPhones: updateData.contactPhones || order.contactPhones,
            projectName: updateData.projectName || order.projectName,
            quotationId: updateData.quotationId || order.quotationId,
            updatedBy: updateData.updatedBy
        })

        // 如果提供了服务项目数据，创建新快照
        if (updateData.selectedServices && updateData.serviceDetails && updateData.policies) {
            console.log('创建新快照版本')

            // 获取当前版本号
            const nextVersion = order.currentVersion + 1

            // 生成新快照
            const newSnapshot = this.generateSnapshot({
                version: nextVersion,
                clientId: order.clientId,
                clientName: order.clientName,
                contactIds: order.contactIds,
                contactNames: order.contactNames,
                contactPhones: order.contactPhones,
                projectName: order.projectName,
                quotationId: order.quotationId,
                selectedServices: updateData.selectedServices || [],
                serviceDetails: updateData.serviceDetails || [],
                policies: updateData.policies || [],
                updatedBy: updateData.updatedBy
            })

            // 更新订单版本信息
            order.currentVersion = nextVersion
            order.currentAmount = newSnapshot.totalAmount
            order.currentAmountRMB = newSnapshot.totalAmountRMB

            // 添加新快照
            order.snapshots.push(newSnapshot)

            // 创建新的订单版本
            try {
                await this.orderVersionService.createOrderVersion({
                    orderId: order._id?.toString() || '',
                    clientId: order.clientId,
                    clientName: order.clientName,
                    contactIds: order.contactIds,
                    contactNames: order.contactNames,
                    contactPhones: order.contactPhones,
                    projectName: order.projectName,
                    quotationId: order.quotationId,
                    selectedServices: updateData.selectedServices || [],
                    serviceDetails: updateData.serviceDetails || [],
                    policies: updateData.policies || [],
                    createdBy: updateData.updatedBy
                })
            } catch (error) {
                console.error('创建订单版本失败:', error)
                // 即使版本创建失败，也不影响订单更新
            }
        } else {
            console.log('仅更新基本信息，不创建新快照')
        }

        return await order.save()
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
        const { page = 1, limit = 10, search, status, clientId } = params
        const skip = (page - 1) * limit

        const filter: any = {}
        if (search) {
            filter.$or = [
                { orderNo: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } }
            ]
        }
        if (status) filter.status = status
        if (clientId) filter.clientId = clientId

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter)
        ])

        return { orders, total }
    }

    /**
     * 获取订单详情
     */
    async getOrderById(orderId: string): Promise<IOrder | null> {
        return await Order.findById(orderId).lean()
    }

    /**
 * 获取订单版本历史
 */
    async getOrderVersionHistory(orderId: string): Promise<any[]> {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('订单不存在')
        }

        return order.snapshots.map(s => ({
            version: s.version,
            createdAt: s.createdAt,
            updatedBy: s.updatedBy,
            totalAmount: s.totalAmount,
            totalItems: s.calculationSummary.totalItems
        }))
    }

    /**
     * 获取指定版本快照
     */
    async getOrderSnapshot(orderId: string, version: number): Promise<IOrderSnapshot | null> {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('订单不存在')
        }
        return order.snapshots.find(s => s.version === version) || null
    }

    /**
     * 生成订单快照
     */
    private generateSnapshot(data: {
        version: number
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
        updatedBy: string
    }): IOrderSnapshot {
        console.log('generateSnapshot 开始执行:', {
            version: data.version,
            selectedServices: data.selectedServices?.length,
            serviceDetails: data.serviceDetails?.length,
            policies: data.policies?.length
        })

        const {
            version,
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
            updatedBy
        } = data

        // 过滤选中的服务
        const selectedServiceDetails = (serviceDetails || []).filter(service =>
            (selectedServices || []).includes(service._id || service.id)
        )

        console.log('过滤后的服务详情:', selectedServiceDetails.length)

        // 生成项目快照
        const items: IOrderItemSnapshot[] = selectedServiceDetails.map(service => {
            const quantity = service.quantity || 1
            const originalPrice = (service.unitPrice || 0) * quantity

            // 使用正确的价格政策计算逻辑
            const calculationResult = calculatePriceWithPolicies(
                originalPrice,
                quantity,
                policies,
                service.selectedPolicies || [],
                service.unit || '件'
            )

            const discountedPrice = calculationResult.discountedPrice
            const discountAmount = calculationResult.discountAmount
            const pricingPolicies: any[] = []

            if (calculationResult.appliedPolicy) {
                // 生成完整的格式化详情
                let formattedDetails = ''
                const actualDiscountRatio = 100 - calculationResult.discountRatio // 实际优惠比例
                
                if (calculationResult.appliedPolicy.type === 'uniform_discount') {
                    // 统一折扣详情
                    formattedDetails = `优惠折扣: 按${calculationResult.discountRatio}%计费<br/>原价: ¥${calculationResult.originalPrice.toLocaleString()}<br/>优惠比例: ${actualDiscountRatio}%<br/>优惠金额: ¥${calculationResult.discountAmount.toLocaleString()}<br/>最终价格: ¥${calculationResult.discountedPrice.toLocaleString()}`
                } else {
                    // 阶梯折扣详情
                    formattedDetails = `计费方式:<br/>${calculationResult.calculationDetails.replace('阶梯折扣: ', '')}<br/>原价: ¥${calculationResult.originalPrice.toLocaleString()}<br/>优惠金额: ¥${calculationResult.discountAmount.toLocaleString()}<br/>最终价格: ¥${calculationResult.discountedPrice.toLocaleString()}`
                }
                
                pricingPolicies.push({
                    policyId: calculationResult.appliedPolicy._id,
                    policyName: calculationResult.appliedPolicy.name,
                    policyType: calculationResult.appliedPolicy.type,
                    discountRatio: calculationResult.discountRatio,
                    calculationDetails: formattedDetails
                })
            }

            return {
                serviceId: service._id || service.id,
                serviceName: service.serviceName,
                categoryName: service.categoryName,
                unitPrice: service.unitPrice,
                unit: service.unit,
                quantity,
                originalPrice,
                discountedPrice,
                discountAmount,
                subtotal: discountedPrice,
                priceDescription: service.priceDescription || `${service.serviceName} - ¥${service.unitPrice}/${service.unit}`,
                pricingPolicies
            }
        })

        // 计算总计
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
        const totalAmountRMB = convertToRMB(totalAmount, true)
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
        const appliedPolicies = Array.from(new Set(
            items.flatMap(item => item.pricingPolicies.map(p => p.policyName))
        ))

        return {
            version,
            createdAt: new Date(),
            updatedBy,
            clientInfo: {
                clientId,
                clientName,
                contactIds,
                contactNames,
                contactPhones
            },
            projectInfo: {
                projectName,
                quotationId
            },
            items,
            totalAmount,
            totalAmountRMB,
            calculationSummary: {
                totalItems: items.length,
                totalQuantity,
                appliedPolicies
            }
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

        // 更新状态
        order.status = status
        order.updatedBy = updatedBy
        order.updateTime = new Date()

        // 保存更新
        await order.save()

        return order
    }

    /**
     * 删除订单
     */
    async deleteOrder(orderId: string): Promise<void> {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('订单不存在')
        }

        // 删除订单
        await Order.findByIdAndDelete(orderId)
    }
}

export default new OrderService() 