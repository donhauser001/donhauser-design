"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalConfigController = void 0;
const AdditionalConfigService_1 = require("../services/AdditionalConfigService");
class AdditionalConfigController {
    static async getAllConfigs(req, res) {
        try {
            const configs = await AdditionalConfigService_1.AdditionalConfigService.getAllConfigs();
            res.json({
                success: true,
                data: configs
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '获取附加配置列表失败'
            });
        }
    }
    static async getConfigById(req, res) {
        try {
            const { id } = req.params;
            const config = await AdditionalConfigService_1.AdditionalConfigService.getConfigById(id);
            if (!config) {
                return res.status(404).json({
                    success: false,
                    message: '附加配置不存在'
                });
            }
            res.json({
                success: true,
                data: config
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '获取附加配置详情失败'
            });
        }
    }
    static async createConfig(req, res) {
        try {
            const configData = req.body;
            const config = await AdditionalConfigService_1.AdditionalConfigService.createConfig(configData);
            res.status(201).json({
                success: true,
                data: config
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '创建附加配置失败'
            });
        }
    }
    static async updateConfig(req, res) {
        try {
            const { id } = req.params;
            const configData = req.body;
            const config = await AdditionalConfigService_1.AdditionalConfigService.updateConfig(id, configData);
            if (!config) {
                return res.status(404).json({
                    success: false,
                    message: '附加配置不存在'
                });
            }
            res.json({
                success: true,
                data: config
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '更新附加配置失败'
            });
        }
    }
    static async toggleConfigStatus(req, res) {
        try {
            const { id } = req.params;
            const config = await AdditionalConfigService_1.AdditionalConfigService.toggleConfigStatus(id);
            if (!config) {
                return res.status(404).json({
                    success: false,
                    message: '附加配置不存在'
                });
            }
            res.json({
                success: true,
                data: config
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '切换附加配置状态失败'
            });
        }
    }
    static async deleteConfig(req, res) {
        try {
            const { id } = req.params;
            await AdditionalConfigService_1.AdditionalConfigService.deleteConfig(id);
            res.json({
                success: true,
                message: '删除成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '删除附加配置失败'
            });
        }
    }
    static async searchConfigs(req, res) {
        try {
            const { search } = req.query;
            const searchTerm = typeof search === 'string' ? search : '';
            const configs = await AdditionalConfigService_1.AdditionalConfigService.searchConfigs(searchTerm);
            res.json({
                success: true,
                data: configs
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '搜索附加配置失败'
            });
        }
    }
}
exports.AdditionalConfigController = AdditionalConfigController;
//# sourceMappingURL=AdditionalConfigController.js.map