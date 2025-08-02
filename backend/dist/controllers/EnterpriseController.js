"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseController = void 0;
const EnterpriseService_1 = require("../services/EnterpriseService");
class EnterpriseController {
    constructor() {
        this.enterpriseService = new EnterpriseService_1.EnterpriseService();
    }
    async getEnterprises(req, res) {
        try {
            const query = {
                search: req.query.search,
                status: req.query.status,
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit) : undefined
            };
            const result = await this.enterpriseService.getEnterprises(query);
            res.json({
                success: true,
                data: result.enterprises,
                total: result.total,
                page: query.page || 1,
                limit: query.limit || 10
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取企业列表失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async getEnterpriseById(req, res) {
        try {
            const { id } = req.params;
            const enterprise = await this.enterpriseService.getEnterpriseById(id);
            if (!enterprise) {
                res.status(404).json({
                    success: false,
                    message: '企业不存在'
                });
                return;
            }
            res.json({
                success: true,
                data: enterprise
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '获取企业信息失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async createEnterprise(req, res) {
        try {
            const enterpriseData = req.body;
            const newEnterprise = await this.enterpriseService.createEnterprise(enterpriseData);
            res.status(201).json({
                success: true,
                message: '企业创建成功',
                data: newEnterprise
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '企业创建失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async updateEnterprise(req, res) {
        try {
            const { id } = req.params;
            const enterpriseData = req.body;
            const updatedEnterprise = await this.enterpriseService.updateEnterprise(id, enterpriseData);
            if (!updatedEnterprise) {
                res.status(404).json({
                    success: false,
                    message: '企业不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '企业信息更新成功',
                data: updatedEnterprise
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: '企业信息更新失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async deleteEnterprise(req, res) {
        try {
            const { id } = req.params;
            const success = await this.enterpriseService.deleteEnterprise(id);
            if (!success) {
                res.status(404).json({
                    success: false,
                    message: '企业不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: '企业删除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '企业删除失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
    async toggleEnterpriseStatus(req, res) {
        try {
            const { id } = req.params;
            const updatedEnterprise = await this.enterpriseService.toggleEnterpriseStatus(id);
            if (!updatedEnterprise) {
                res.status(404).json({
                    success: false,
                    message: '企业不存在'
                });
                return;
            }
            res.json({
                success: true,
                message: `企业已${updatedEnterprise.status === 'active' ? '启用' : '禁用'}`,
                data: updatedEnterprise
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: '切换企业状态失败',
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
    }
}
exports.EnterpriseController = EnterpriseController;
//# sourceMappingURL=EnterpriseController.js.map