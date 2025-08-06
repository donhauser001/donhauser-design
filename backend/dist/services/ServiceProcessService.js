"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProcessService = void 0;
const ServiceProcess_1 = __importDefault(require("../models/ServiceProcess"));
class ServiceProcessService {
    async getAllProcesses() {
        try {
            const processes = await ServiceProcess_1.default.find().sort({ createTime: -1 });
            return processes;
        }
        catch (error) {
            throw new Error('获取服务流程列表失败');
        }
    }
    async getProcessById(id) {
        try {
            const process = await ServiceProcess_1.default.findById(id);
            if (!process) {
                throw new Error('服务流程不存在');
            }
            return process;
        }
        catch (error) {
            throw new Error('获取服务流程详情失败');
        }
    }
    async createProcess(processData) {
        try {
            const process = new ServiceProcess_1.default(processData);
            await process.save();
            return process;
        }
        catch (error) {
            throw new Error('创建服务流程失败');
        }
    }
    async updateProcess(id, updateData) {
        try {
            const process = await ServiceProcess_1.default.findByIdAndUpdate(id, { ...updateData, updateTime: new Date() }, { new: true });
            if (!process) {
                throw new Error('服务流程不存在');
            }
            return process;
        }
        catch (error) {
            throw new Error('更新服务流程失败');
        }
    }
    async toggleProcessStatus(id) {
        try {
            const process = await ServiceProcess_1.default.findById(id);
            if (!process) {
                throw new Error('服务流程不存在');
            }
            process.status = process.status === 'active' ? 'inactive' : 'active';
            process.updateTime = new Date();
            await process.save();
            return process;
        }
        catch (error) {
            throw new Error('切换服务流程状态失败');
        }
    }
    async deleteProcess(id) {
        try {
            const process = await ServiceProcess_1.default.findByIdAndDelete(id);
            if (!process) {
                throw new Error('服务流程不存在');
            }
            return process;
        }
        catch (error) {
            throw new Error('删除服务流程失败');
        }
    }
    async searchProcesses(searchTerm) {
        try {
            const processes = await ServiceProcess_1.default.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            }).sort({ createTime: -1 });
            return processes;
        }
        catch (error) {
            throw new Error('搜索服务流程失败');
        }
    }
}
exports.ServiceProcessService = ServiceProcessService;
exports.default = new ServiceProcessService();
//# sourceMappingURL=ServiceProcessService.js.map