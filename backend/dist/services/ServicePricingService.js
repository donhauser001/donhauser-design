"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePricingService = void 0;
const ServicePricing_1 = __importDefault(require("../models/ServicePricing"));
const PricingCategoryService_1 = require("./PricingCategoryService");
const AdditionalConfig_1 = __importDefault(require("../models/AdditionalConfig"));
const ServiceProcess_1 = __importDefault(require("../models/ServiceProcess"));
const PricingPolicy_1 = __importDefault(require("../models/PricingPolicy"));
class ServicePricingService {
    static async getAllServicePricing() {
        try {
            return await ServicePricing_1.default.find().sort({ createTime: -1 });
        }
        catch (error) {
            throw new Error('获取服务定价列表失败');
        }
    }
    static async getServicePricingById(id) {
        try {
            const service = await ServicePricing_1.default.findById(id);
            if (!service) {
                return null;
            }
            if (service.pricingPolicyNames && service.pricingPolicyNames.length > 0) {
                return service;
            }
            if (service.pricingPolicyIds && service.pricingPolicyIds.length > 0) {
                const policies = await PricingPolicy_1.default.find({ _id: { $in: service.pricingPolicyIds } });
                const pricingPolicyNames = policies.map(policy => policy.name);
                await ServicePricing_1.default.findByIdAndUpdate(service._id, {
                    pricingPolicyNames: pricingPolicyNames
                });
                return {
                    ...service.toObject(),
                    pricingPolicyNames: pricingPolicyNames
                };
            }
            return service;
        }
        catch (error) {
            throw new Error('获取服务定价详情失败');
        }
    }
    static async getServicePricingByIds(ids) {
        try {
            const servicePricingList = await ServicePricing_1.default.find({ _id: { $in: ids } });
            const enrichedServicePricing = await Promise.all(servicePricingList.map(async (service) => {
                if (service.pricingPolicyNames && service.pricingPolicyNames.length > 0) {
                    return service;
                }
                if (service.pricingPolicyIds && service.pricingPolicyIds.length > 0) {
                    const policies = await PricingPolicy_1.default.find({ _id: { $in: service.pricingPolicyIds } });
                    const pricingPolicyNames = policies.map(policy => policy.name);
                    await ServicePricing_1.default.findByIdAndUpdate(service._id, {
                        pricingPolicyNames: pricingPolicyNames
                    });
                    return {
                        ...service.toObject(),
                        pricingPolicyNames: pricingPolicyNames
                    };
                }
                return service;
            }));
            return enrichedServicePricing;
        }
        catch (error) {
            throw new Error('获取服务定价列表失败');
        }
    }
    static async createServicePricing(data) {
        try {
            const category = await PricingCategoryService_1.PricingCategoryService.getCategoryById(data.categoryId);
            const additionalConfig = data.additionalConfigId ? await AdditionalConfig_1.default.findById(data.additionalConfigId) : null;
            const serviceProcess = data.serviceProcessId ? await ServiceProcess_1.default.findById(data.serviceProcessId) : null;
            let pricingPolicyNames = [];
            if (data.pricingPolicyIds && data.pricingPolicyIds.length > 0) {
                const policies = await PricingPolicy_1.default.find({ _id: { $in: data.pricingPolicyIds } });
                pricingPolicyNames = policies.map(policy => policy.name);
            }
            const servicePricing = new ServicePricing_1.default({
                ...data,
                categoryName: category?.name,
                additionalConfigName: additionalConfig?.name,
                serviceProcessName: serviceProcess?.name,
                pricingPolicyNames: pricingPolicyNames
            });
            return await servicePricing.save();
        }
        catch (error) {
            throw new Error('创建服务定价失败');
        }
    }
    static async updateServicePricing(id, data) {
        try {
            console.log('更新服务定价 - 输入数据:', { id, data });
            const category = await PricingCategoryService_1.PricingCategoryService.getCategoryById(data.categoryId);
            console.log('获取到的分类:', category);
            const additionalConfig = data.additionalConfigId ? await AdditionalConfig_1.default.findById(data.additionalConfigId) : null;
            const serviceProcess = data.serviceProcessId ? await ServiceProcess_1.default.findById(data.serviceProcessId) : null;
            let pricingPolicyNames = [];
            if (data.pricingPolicyIds && data.pricingPolicyIds.length > 0) {
                const policies = await PricingPolicy_1.default.find({ _id: { $in: data.pricingPolicyIds } });
                pricingPolicyNames = policies.map(policy => policy.name);
            }
            const updateData = {
                ...data,
                categoryName: category?.name,
                additionalConfigName: additionalConfig?.name,
                serviceProcessName: serviceProcess?.name,
                pricingPolicyNames: pricingPolicyNames
            };
            console.log('更新数据:', updateData);
            const result = await ServicePricing_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            console.log('更新结果:', result);
            return result;
        }
        catch (error) {
            console.error('更新服务定价详细错误:', error);
            throw new Error(`更新服务定价失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    static async toggleServicePricingStatus(id) {
        try {
            const servicePricing = await ServicePricing_1.default.findById(id);
            if (!servicePricing) {
                throw new Error('服务定价不存在');
            }
            servicePricing.status = servicePricing.status === 'active' ? 'inactive' : 'active';
            return await servicePricing.save();
        }
        catch (error) {
            throw new Error('切换服务定价状态失败');
        }
    }
    static async deleteServicePricing(id) {
        try {
            const result = await ServicePricing_1.default.findByIdAndDelete(id);
            if (!result) {
                throw new Error('服务定价不存在');
            }
        }
        catch (error) {
            throw new Error('删除服务定价失败');
        }
    }
    static async searchServicePricing(searchTerm) {
        try {
            const regex = new RegExp(searchTerm, 'i');
            return await ServicePricing_1.default.find({
                $or: [
                    { serviceName: regex },
                    { alias: regex },
                    { priceDescription: regex }
                ]
            }).sort({ createTime: -1 });
        }
        catch (error) {
            throw new Error('搜索服务定价失败');
        }
    }
}
exports.ServicePricingService = ServicePricingService;
//# sourceMappingURL=ServicePricingService.js.map