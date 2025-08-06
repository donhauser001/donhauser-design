import { OrderVersion, IOrderVersion } from '../models/OrderVersion'
import { convertToRMB } from '../utils/rmbConverter'
import { calculatePriceWithPolicies } from '../utils/pricePolicyCalculator'

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
        console.log('开始创建订单版本，输入数据:', versionData)

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
        console.log(`订单 ${orderId} 当前最新版本: ${latestVersion}, 新版本号: ${newVersionNumber}`)

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

        console.log('生成的版本快照:', versionSnapshot)

        // 详细输出价格政策信息用于调试
        if (versionSnapshot.items) {
            versionSnapshot.items.forEach((item, index) => {
                console.log(`🔍 项目 ${index + 1} - ${item.serviceName}:`)
                console.log(`  数量: ${item.quantity}${item.unit}`)
                console.log(`  单价: ¥${item.unitPrice}`)
                console.log(`  原价: ¥${item.originalPrice}`)
                console.log(`  折后价: ¥${item.discountedPrice}`)
                console.log(`  优惠: ¥${item.discountAmount}`)
                console.log(`  价格政策数量:`, item.pricingPolicies?.length || 0)
                if (item.pricingPolicies && item.pricingPolicies.length > 0) {
                    item.pricingPolicies.forEach((policy, pIndex) => {
                        console.log(`    政策 ${pIndex + 1}: ${policy.policyName}`)
                        console.log(`    政策类型: ${policy.policyType}`)
                        console.log(`    计算详情: ${policy.calculationDetails}`)
                    })
                } else {
                    console.log(`    ❌ 无价格政策应用`)
                }
                console.log('---')
            })
        }

        // 创建版本记录
        const orderVersion = new OrderVersion({
            orderId,
            versionNumber: newVersionNumber,
            iterationTime: new Date(),
            ...versionSnapshot,
            createdBy
        })

        const savedVersion = await orderVersion.save()
        console.log('订单版本保存成功:', savedVersion)

        return savedVersion
    }

    /**
     * 获取订单的所有版本
     */
    async getOrderVersions(orderId: string): Promise<IOrderVersion[]> {
        return await OrderVersion.find({ orderId })
            .sort({ updatedAt: -1 })
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
            const unit = service.unit || '项'

            // 查找应用的价格政策 - 改进匹配逻辑
            const appliedPolicies = (policies || []).filter(policy => {
                // 支持多种数据结构
                if (policy.serviceId) {
                    // 如果政策有serviceId字段，直接匹配
                    return policy.serviceId === serviceId ||
                        (Array.isArray(policy.serviceId) && policy.serviceId.includes(serviceId))
                } else if (policy.selectedPolicies) {
                    // 如果政策有selectedPolicies字段，检查是否包含当前服务
                    return policy.selectedPolicies.includes(serviceId)
                }
                return false
            })

            // 计算价格 - 使用专业的价格计算工具
            let originalPrice = unitPrice * quantity
            let discountedPrice = originalPrice
            let discountAmount = 0
            let pricingPolicies: any[] = []

            if (appliedPolicies.length > 0) {
                // 确保政策有正确的_id字段供价格计算器使用
                const normalizedPolicies = appliedPolicies.map(policy => ({
                    ...policy,
                    _id: policy.policyId || policy._id,
                    status: 'active' // 确保通过状态检查
                }))

                // 使用价格计算工具获取详细的计算结果
                const selectedPolicyIds = normalizedPolicies.map(p => p._id)

                const calculationResult = calculatePriceWithPolicies(
                    originalPrice,
                    quantity,
                    normalizedPolicies,
                    selectedPolicyIds,
                    unit
                )

                discountedPrice = calculationResult.discountedPrice
                discountAmount = calculationResult.discountAmount

                // 为每个应用的政策生成详细信息，并进行去重
                const uniqueAppliedPolicies = appliedPolicies.filter((policy, index, self) =>
                    index === self.findIndex(p => (p.policyId || p._id) === (policy.policyId || policy._id))
                )

                pricingPolicies = uniqueAppliedPolicies.map(policy => ({
                    policyId: policy.policyId || policy._id,
                    policyName: policy.name || policy.policyName,
                    policyType: policy.type || policy.policyType || 'uniform_discount',
                    discountRatio: policy.discountRatio || 0,
                    calculationDetails: calculationResult.calculationDetails || `应用政策: ${policy.name || policy.policyName}`
                }))
            }

            return {
                serviceId,
                serviceName: service.serviceName || service.name,
                categoryName: service.categoryName || '',
                unitPrice,
                unit,
                quantity,
                originalPrice,
                discountedPrice,
                discountAmount,
                subtotal: discountedPrice,
                priceDescription: (service.priceDescription || '').replace(/<br\s*\/?>/gi, '\n'),
                pricingPolicies
            }
        })

        // 计算总金额
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
        const totalAmountRMB = convertToRMB(totalAmount, true)

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