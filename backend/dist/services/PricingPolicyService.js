"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPolicyService = void 0;
const PricingPolicy_1 = __importDefault(require("../models/PricingPolicy"));
class PricingPolicyService {
    static async getAllPolicies() {
        try {
            const policies = await PricingPolicy_1.default.find().sort({ createTime: -1 });
            return policies.map(policy => {
                if (policy.tierSettings) {
                    policy.tierSettings = policy.tierSettings.map(tier => {
                        const newTier = { ...tier.toObject() };
                        if (newTier.minQuantity !== undefined && newTier.startQuantity === undefined) {
                            newTier.startQuantity = newTier.minQuantity;
                        }
                        if (newTier.maxQuantity !== undefined && newTier.endQuantity === undefined) {
                            newTier.endQuantity = newTier.maxQuantity;
                        }
                        if (newTier.minAmount !== undefined && newTier.startQuantity === undefined) {
                            newTier.startQuantity = newTier.minAmount;
                        }
                        if (newTier.maxAmount !== undefined && newTier.endQuantity === undefined) {
                            newTier.endQuantity = newTier.maxAmount;
                        }
                        return newTier;
                    });
                }
                return policy;
            });
        }
        catch (error) {
            throw new Error('获取价格政策列表失败');
        }
    }
    static async getPolicyById(id) {
        try {
            const policy = await PricingPolicy_1.default.findById(id);
            if (!policy)
                return null;
            if (policy.tierSettings) {
                policy.tierSettings = policy.tierSettings.map(tier => {
                    const newTier = { ...tier.toObject() };
                    if (newTier.minQuantity !== undefined && newTier.startQuantity === undefined) {
                        newTier.startQuantity = newTier.minQuantity;
                    }
                    if (newTier.maxQuantity !== undefined && newTier.endQuantity === undefined) {
                        newTier.endQuantity = newTier.maxQuantity;
                    }
                    if (newTier.minAmount !== undefined && newTier.startQuantity === undefined) {
                        newTier.startQuantity = newTier.minAmount;
                    }
                    if (newTier.maxAmount !== undefined && newTier.endQuantity === undefined) {
                        newTier.endQuantity = newTier.maxAmount;
                    }
                    return newTier;
                });
            }
            return policy;
        }
        catch (error) {
            throw new Error('获取价格政策详情失败');
        }
    }
    static async createPolicy(data) {
        try {
            if (data.tierSettings) {
                data.tierSettings = data.tierSettings.map((tier, index) => ({
                    ...tier,
                    id: `tier_${Date.now()}_${index}`
                }));
            }
            const policy = new PricingPolicy_1.default(data);
            return await policy.save();
        }
        catch (error) {
            throw new Error('创建价格政策失败');
        }
    }
    static async updatePolicy(id, data) {
        try {
            if (data.tierSettings) {
                data.tierSettings = data.tierSettings.map((tier, index) => ({
                    ...tier,
                    id: tier.id || `tier_${Date.now()}_${index}`
                }));
            }
            return await PricingPolicy_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        }
        catch (error) {
            throw new Error('更新价格政策失败');
        }
    }
    static async togglePolicyStatus(id) {
        try {
            const policy = await PricingPolicy_1.default.findById(id);
            if (!policy) {
                throw new Error('价格政策不存在');
            }
            if (policy.tierSettings) {
                policy.tierSettings = policy.tierSettings.map(tier => {
                    const newTier = { ...tier.toObject() };
                    if (newTier.minQuantity !== undefined && newTier.startQuantity === undefined) {
                        newTier.startQuantity = newTier.minQuantity;
                        delete newTier.minQuantity;
                    }
                    if (newTier.maxQuantity !== undefined && newTier.endQuantity === undefined) {
                        newTier.endQuantity = newTier.maxQuantity;
                        delete newTier.maxQuantity;
                    }
                    if (newTier.minAmount !== undefined && newTier.startQuantity === undefined) {
                        newTier.startQuantity = newTier.minAmount;
                        delete newTier.minAmount;
                    }
                    if (newTier.maxAmount !== undefined && newTier.endQuantity === undefined) {
                        newTier.endQuantity = newTier.maxAmount;
                        delete newTier.maxAmount;
                    }
                    return newTier;
                });
            }
            policy.status = policy.status === 'active' ? 'inactive' : 'active';
            return await policy.save();
        }
        catch (error) {
            throw new Error('切换价格政策状态失败');
        }
    }
    static async deletePolicy(id) {
        try {
            const result = await PricingPolicy_1.default.findByIdAndDelete(id);
            if (!result) {
                throw new Error('价格政策不存在');
            }
        }
        catch (error) {
            throw new Error('删除价格政策失败');
        }
    }
    static async searchPolicies(searchTerm) {
        try {
            const regex = new RegExp(searchTerm, 'i');
            return await PricingPolicy_1.default.find({
                $or: [
                    { name: regex },
                    { alias: regex },
                    { summary: regex }
                ]
            }).sort({ createTime: -1 });
        }
        catch (error) {
            throw new Error('搜索价格政策失败');
        }
    }
}
exports.PricingPolicyService = PricingPolicyService;
//# sourceMappingURL=PricingPolicyService.js.map