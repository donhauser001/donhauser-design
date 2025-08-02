import ServicePricing, { IServicePricing } from '../models/ServicePricing'
import { PricingCategoryService } from './PricingCategoryService'
import AdditionalConfig from '../models/AdditionalConfig'
import ServiceProcess from '../models/ServiceProcess'
import PricingPolicy from '../models/PricingPolicy'

export interface CreateServicePricingData {
    serviceName: string
    alias: string
    categoryId: string
    unitPrice: number
    unit: string
    priceDescription: string
    link: string
    additionalConfigId?: string
    serviceProcessId?: string
    pricingPolicyIds?: string[]
}

export interface UpdateServicePricingData {
    serviceName: string
    alias: string
    categoryId: string
    unitPrice: number
    unit: string
    priceDescription: string
    link: string
    additionalConfigId?: string
    serviceProcessId?: string
    pricingPolicyIds?: string[]
}

export class ServicePricingService {
    // 获取所有服务定价
    static async getAllServicePricing(): Promise<IServicePricing[]> {
        try {
            return await ServicePricing.find().sort({ createTime: -1 })
        } catch (error) {
            throw new Error('获取服务定价列表失败')
        }
    }

    // 根据ID获取服务定价
    static async getServicePricingById(id: string): Promise<IServicePricing | null> {
        try {
            return await ServicePricing.findById(id)
        } catch (error) {
            throw new Error('获取服务定价详情失败')
        }
    }

    // 根据ID列表获取服务定价
    static async getServicePricingByIds(ids: string[]): Promise<IServicePricing[]> {
        try {
            return await ServicePricing.find({ _id: { $in: ids } })
        } catch (error) {
            throw new Error('获取服务定价列表失败')
        }
    }

    // 创建服务定价
    static async createServicePricing(data: CreateServicePricingData): Promise<IServicePricing> {
        try {
            // 获取关联数据的名称
            const category = PricingCategoryService.prototype.getCategoryById(data.categoryId)
            const additionalConfig = data.additionalConfigId ? await AdditionalConfig.findById(data.additionalConfigId) : null
            const serviceProcess = data.serviceProcessId ? await ServiceProcess.findById(data.serviceProcessId) : null

            // 获取价格政策名称
            let pricingPolicyNames: string[] = []
            if (data.pricingPolicyIds && data.pricingPolicyIds.length > 0) {
                const policies = await PricingPolicy.find({ _id: { $in: data.pricingPolicyIds } })
                pricingPolicyNames = policies.map(policy => policy.name)
            }

            const servicePricing = new ServicePricing({
                ...data,
                categoryName: category?.name,
                additionalConfigName: additionalConfig?.name,
                serviceProcessName: serviceProcess?.name,
                pricingPolicyNames: pricingPolicyNames
            })

            return await servicePricing.save()
        } catch (error) {
            throw new Error('创建服务定价失败')
        }
    }

    // 更新服务定价
    static async updateServicePricing(id: string, data: UpdateServicePricingData): Promise<IServicePricing | null> {
        try {
            // 获取关联数据的名称
            const category = PricingCategoryService.prototype.getCategoryById(data.categoryId)
            const additionalConfig = data.additionalConfigId ? await AdditionalConfig.findById(data.additionalConfigId) : null
            const serviceProcess = data.serviceProcessId ? await ServiceProcess.findById(data.serviceProcessId) : null

            // 获取价格政策名称
            let pricingPolicyNames: string[] = []
            if (data.pricingPolicyIds && data.pricingPolicyIds.length > 0) {
                const policies = await PricingPolicy.find({ _id: { $in: data.pricingPolicyIds } })
                pricingPolicyNames = policies.map(policy => policy.name)
            }

            return await ServicePricing.findByIdAndUpdate(
                id,
                {
                    ...data,
                    categoryName: category?.name,
                    additionalConfigName: additionalConfig?.name,
                    serviceProcessName: serviceProcess?.name,
                    pricingPolicyNames: pricingPolicyNames
                },
                { new: true, runValidators: true }
            )
        } catch (error) {
            throw new Error('更新服务定价失败')
        }
    }

    // 切换服务定价状态
    static async toggleServicePricingStatus(id: string): Promise<IServicePricing | null> {
        try {
            const servicePricing = await ServicePricing.findById(id)
            if (!servicePricing) {
                throw new Error('服务定价不存在')
            }

            servicePricing.status = servicePricing.status === 'active' ? 'inactive' : 'active'
            return await servicePricing.save()
        } catch (error) {
            throw new Error('切换服务定价状态失败')
        }
    }

    // 删除服务定价
    static async deleteServicePricing(id: string): Promise<void> {
        try {
            const result = await ServicePricing.findByIdAndDelete(id)
            if (!result) {
                throw new Error('服务定价不存在')
            }
        } catch (error) {
            throw new Error('删除服务定价失败')
        }
    }

    // 搜索服务定价
    static async searchServicePricing(searchTerm: string): Promise<IServicePricing[]> {
        try {
            const regex = new RegExp(searchTerm, 'i')
            return await ServicePricing.find({
                $or: [
                    { serviceName: regex },
                    { alias: regex },
                    { priceDescription: regex }
                ]
            }).sort({ createTime: -1 })
        } catch (error) {
            throw new Error('搜索服务定价失败')
        }
    }
} 