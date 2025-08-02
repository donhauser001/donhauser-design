import { OrderVersion, IOrderVersion } from '../models/OrderVersion'
import { convertToRMB } from '../utils/rmbConverter'

export class OrderVersionService {
    /**
     * 创建订单版本
     */
    async createOrderVersion(versionData: {
        orderId: string
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
    }): Promise<IOrderVersion> {
        const {
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
        } = versionData

        // 获取当前订单的最新版本号
        const latestVersion = await this.getLatestVersionNumber(orderId)
        const newVersionNumber = latestVersion + 1

        // 生成版本数据
        const versionSnapshot = this.generateVersionSnapshot({
            clientId,
            clientName,
            contactIds,
            contactNames,
            contactPhones,
            projectName,
            quotationId,
            selectedServices,
            serviceDetails,
            policies
        })

        // 创建版本记录
        const orderVersion = new OrderVersion({
            orderId,
            versionNumber: newVersionNumber,
            iterationTime: new Date(),
            ...versionSnapshot,
            createdBy
        })

        return await orderVersion.save()
    }

    /**
     * 获取订单的所有版本
     */
    async getOrderVersions(orderId: string): Promise<IOrderVersion[]> {
        return await OrderVersion.find({ orderId })
            .sort({ versionNumber: -1 })
            .exec()
    }

    /**
     * 获取订单的特定版本
     */
    async getOrderVersion(orderId: string, versionNumber: number): Promise<IOrderVersion | null> {
        return await OrderVersion.findOne({ orderId, versionNumber }).exec()
    }

    /**
     * 获取订单的最新版本
     */
    async getLatestOrderVersion(orderId: string): Promise<IOrderVersion | null> {
        return await OrderVersion.findOne({ orderId })
            .sort({ versionNumber: -1 })
            .exec()
    }

    /**
     * 获取订单的最新版本号
     */
    async getLatestVersionNumber(orderId: string): Promise<number> {
        const latestVersion = await OrderVersion.findOne({ orderId })
            .sort({ versionNumber: -1 })
            .select('versionNumber')
            .exec()

        return latestVersion ? latestVersion.versionNumber : 0
    }

    /**
     * 删除订单的所有版本
     */
    async deleteOrderVersions(orderId: string): Promise<void> {
        await OrderVersion.deleteMany({ orderId }).exec()
    }

    /**
     * 生成版本快照
     */
    private generateVersionSnapshot(data: {
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
    }) {
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
            policies
        } = data

        // 过滤选中的服务
        const selectedServiceDetails = (serviceDetails || []).filter(service =>
            (selectedServices || []).includes(service._id || service.id)
        )

        // 生成项目快照
        const items = selectedServiceDetails.map(service => {
            const serviceId = service._id || service.id
            const unitPrice = service.unitPrice || 0
            const quantity = service.quantity || 1

            // 查找应用的价格政策
            const appliedPolicies = (policies || []).filter(policy =>
                policy.serviceId === serviceId
            )

            // 计算价格
            let originalPrice = unitPrice * quantity
            let discountedPrice = originalPrice
            let discountAmount = 0
            let pricingPolicies: any[] = []

            if (appliedPolicies.length > 0) {
                const policy = appliedPolicies[0]
                const discountRatio = policy.discountRatio || 1
                discountedPrice = originalPrice * discountRatio
                discountAmount = originalPrice - discountedPrice

                pricingPolicies = [{
                    policyId: policy.policyId || policy._id,
                    policyName: policy.name || policy.policyName,
                    policyType: policy.type || 'uniform_discount',
                    discountRatio: discountRatio,
                    calculationDetails: `应用政策: ${policy.name || policy.policyName}`
                }]
            }

            return {
                serviceId,
                serviceName: service.serviceName || service.name,
                categoryName: service.categoryName || '',
                unitPrice,
                unit: service.unit || '项',
                quantity,
                originalPrice,
                discountedPrice,
                discountAmount,
                subtotal: discountedPrice,
                priceDescription: service.priceDescription || '',
                pricingPolicies
            }
        })

        // 计算总金额
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
        const totalAmountRMB = convertToRMB(totalAmount)

        // 计算摘要
        const totalItems = items.length
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
        const appliedPolicies = [...new Set(items.flatMap(item =>
            item.pricingPolicies.map(p => p.policyId)
        ))]

        return {
            clientId,
            clientName,
            contactIds,
            contactNames,
            contactPhones,
            projectName,
            quotationId,
            items,
            totalAmount,
            totalAmountRMB,
            calculationSummary: {
                totalItems,
                totalQuantity,
                appliedPolicies
            }
        }
    }
} 