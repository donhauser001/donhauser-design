"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalConfigService = void 0;
const AdditionalConfig_1 = __importDefault(require("../models/AdditionalConfig"));
class AdditionalConfigService {
    static async getAllConfigs() {
        try {
            return await AdditionalConfig_1.default.find().sort({ createTime: -1 });
        }
        catch (error) {
            throw new Error('获取附加配置列表失败');
        }
    }
    static async getConfigById(id) {
        try {
            return await AdditionalConfig_1.default.findById(id);
        }
        catch (error) {
            throw new Error('获取附加配置详情失败');
        }
    }
    static async createConfig(data) {
        try {
            const config = new AdditionalConfig_1.default(data);
            return await config.save();
        }
        catch (error) {
            throw new Error('创建附加配置失败');
        }
    }
    static async updateConfig(id, data) {
        try {
            return await AdditionalConfig_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        }
        catch (error) {
            throw new Error('更新附加配置失败');
        }
    }
    static async toggleConfigStatus(id) {
        try {
            const config = await AdditionalConfig_1.default.findById(id);
            if (!config) {
                throw new Error('附加配置不存在');
            }
            config.status = config.status === 'active' ? 'inactive' : 'active';
            return await config.save();
        }
        catch (error) {
            throw new Error('切换附加配置状态失败');
        }
    }
    static async deleteConfig(id) {
        try {
            const result = await AdditionalConfig_1.default.findByIdAndDelete(id);
            if (!result) {
                throw new Error('附加配置不存在');
            }
        }
        catch (error) {
            throw new Error('删除附加配置失败');
        }
    }
    static async searchConfigs(searchTerm) {
        try {
            const regex = new RegExp(searchTerm, 'i');
            return await AdditionalConfig_1.default.find({
                $or: [
                    { name: regex },
                    { description: regex }
                ]
            }).sort({ createTime: -1 });
        }
        catch (error) {
            throw new Error('搜索附加配置失败');
        }
    }
}
exports.AdditionalConfigService = AdditionalConfigService;
//# sourceMappingURL=AdditionalConfigService.js.map