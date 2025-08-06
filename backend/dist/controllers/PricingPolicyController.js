"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPolicyController = void 0;
const PricingPolicyService_1 = require("../services/PricingPolicyService");
class PricingPolicyController {
    static async getAllPolicies(req, res) {
        try {
            const policies = await PricingPolicyService_1.PricingPolicyService.getAllPolicies();
            res.json({
                success: true,
                data: policies
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '获取价格政策列表失败'
            });
        }
    }
    static async getPolicyById(req, res) {
        try {
            const { id } = req.params;
            const policy = await PricingPolicyService_1.PricingPolicyService.getPolicyById(id);
            if (!policy) {
                return res.status(404).json({
                    success: false,
                    error: '价格政策不存在'
                });
            }
            res.json({
                success: true,
                data: policy
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '获取价格政策详情失败'
            });
        }
    }
    static async createPolicy(req, res) {
        try {
            const policyData = req.body;
            const policy = await PricingPolicyService_1.PricingPolicyService.createPolicy(policyData);
            res.status(201).json({
                success: true,
                data: policy
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '创建价格政策失败'
            });
        }
    }
    static async updatePolicy(req, res) {
        try {
            const { id } = req.params;
            const policyData = req.body;
            const policy = await PricingPolicyService_1.PricingPolicyService.updatePolicy(id, policyData);
            if (!policy) {
                return res.status(404).json({
                    success: false,
                    error: '价格政策不存在'
                });
            }
            res.json({
                success: true,
                data: policy
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '更新价格政策失败'
            });
        }
    }
    static async togglePolicyStatus(req, res) {
        try {
            const { id } = req.params;
            const policy = await PricingPolicyService_1.PricingPolicyService.togglePolicyStatus(id);
            if (!policy) {
                return res.status(404).json({
                    success: false,
                    error: '价格政策不存在'
                });
            }
            res.json({
                success: true,
                data: policy
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '切换价格政策状态失败'
            });
        }
    }
    static async deletePolicy(req, res) {
        try {
            const { id } = req.params;
            await PricingPolicyService_1.PricingPolicyService.deletePolicy(id);
            res.json({
                success: true,
                message: '价格政策删除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '删除价格政策失败'
            });
        }
    }
    static async searchPolicies(req, res) {
        try {
            const { search } = req.query;
            if (!search || typeof search !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: '搜索关键词不能为空'
                });
            }
            const policies = await PricingPolicyService_1.PricingPolicyService.searchPolicies(search);
            res.json({
                success: true,
                data: policies
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : '搜索价格政策失败'
            });
        }
    }
}
exports.PricingPolicyController = PricingPolicyController;
//# sourceMappingURL=PricingPolicyController.js.map