"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderVersionService = void 0;
const OrderVersion_1 = require("../models/OrderVersion");
const rmbConverter_1 = require("../utils/rmbConverter");
const pricePolicyCalculator_1 = require("../utils/pricePolicyCalculator");
class OrderVersionService {
    async createOrderVersion(versionData) {
        console.log('开始创建订单版本，输入数据:', versionData);
        const { orderId, clientId, clientName, contactIds, contactNames, contactPhones, projectName, quotationId, selectedServices, serviceDetails, policies, createdBy } = versionData;
        const latestVersion = await this.getLatestVersionNumber(orderId);
        const newVersionNumber = latestVersion + 1;
        console.log(`订单 ${orderId} 当前最新版本: ${latestVersion}, 新版本号: ${newVersionNumber}`);
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
        });
        console.log('生成的版本快照:', versionSnapshot);
        const orderVersion = new OrderVersion_1.OrderVersion({
            orderId,
            versionNumber: newVersionNumber,
            iterationTime: new Date(),
            ...versionSnapshot,
            createdBy
        });
        const savedVersion = await orderVersion.save();
        console.log('订单版本保存成功:', savedVersion);
        return savedVersion;
    }
    async getOrderVersions(orderId) {
        return await OrderVersion_1.OrderVersion.find({ orderId })
            .sort({ versionNumber: -1 })
            .exec();
    }
    async getOrderVersion(orderId, versionNumber) {
        return await OrderVersion_1.OrderVersion.findOne({ orderId, versionNumber }).exec();
    }
    async getLatestOrderVersion(orderId) {
        return await OrderVersion_1.OrderVersion.findOne({ orderId })
            .sort({ versionNumber: -1 })
            .exec();
    }
    async getLatestVersionNumber(orderId) {
        const latestVersion = await OrderVersion_1.OrderVersion.findOne({ orderId })
            .sort({ versionNumber: -1 })
            .select('versionNumber')
            .exec();
        return latestVersion ? latestVersion.versionNumber : 0;
    }
    async deleteOrderVersions(orderId) {
        await OrderVersion_1.OrderVersion.deleteMany({ orderId }).exec();
    }
    generateVersionSnapshot(data) {
        const { clientId, clientName, contactIds, contactNames, contactPhones, projectName, quotationId, selectedServices, serviceDetails, policies } = data;
        const selectedServiceDetails = (serviceDetails || []).filter(service => (selectedServices || []).includes(service._id || service.id));
        const items = selectedServiceDetails.map(service => {
            const serviceId = service._id || service.id;
            const unitPrice = service.unitPrice || 0;
            const quantity = service.quantity || 1;
            const unit = service.unit || '项';
            const appliedPolicies = (policies || []).filter(policy => {
                if (policy.serviceId) {
                    return policy.serviceId === serviceId ||
                        (Array.isArray(policy.serviceId) && policy.serviceId.includes(serviceId));
                }
                else if (policy.selectedPolicies) {
                    return policy.selectedPolicies.includes(serviceId);
                }
                return false;
            });
            let originalPrice = unitPrice * quantity;
            let discountedPrice = originalPrice;
            let discountAmount = 0;
            let pricingPolicies = [];
            if (appliedPolicies.length > 0) {
                const selectedPolicyIds = appliedPolicies.map(p => p.policyId || p._id);
                const calculationResult = (0, pricePolicyCalculator_1.calculatePriceWithPolicies)(originalPrice, quantity, appliedPolicies, selectedPolicyIds, unit);
                discountedPrice = calculationResult.discountedPrice;
                discountAmount = calculationResult.discountAmount;
                pricingPolicies = appliedPolicies.map(policy => ({
                    policyId: policy.policyId || policy._id,
                    policyName: policy.name || policy.policyName,
                    policyType: policy.type || policy.policyType || 'uniform_discount',
                    discountRatio: policy.discountRatio || 0,
                    calculationDetails: calculationResult.calculationDetails || `应用政策: ${policy.name || policy.policyName}`
                }));
                console.log(`服务 ${service.serviceName} 价格计算结果:`, {
                    originalPrice,
                    discountedPrice,
                    discountAmount,
                    appliedPolicies: pricingPolicies.length,
                    calculationDetails: calculationResult.calculationDetails
                });
            }
            else {
                console.log(`服务 ${service.serviceName} 未应用价格政策`);
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
            };
        });
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const totalAmountRMB = (0, rmbConverter_1.convertToRMB)(totalAmount);
        const totalItems = items.length;
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const appliedPolicies = [...new Set(items.flatMap(item => item.pricingPolicies.map(p => p.policyId)))];
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
        };
    }
}
exports.OrderVersionService = OrderVersionService;
//# sourceMappingURL=OrderVersionService.js.map