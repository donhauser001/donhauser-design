"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProcessController = void 0;
const ServiceProcessService_1 = __importDefault(require("../services/ServiceProcessService"));
class ServiceProcessController {
    async getAllProcesses(req, res) {
        try {
            const processes = await ServiceProcessService_1.default.getAllProcesses();
            res.json({
                success: true,
                data: processes,
                message: '获取服务流程列表成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '获取服务流程列表失败'
            });
        }
    }
    async getProcessById(req, res) {
        try {
            const { id } = req.params;
            const process = await ServiceProcessService_1.default.getProcessById(id);
            res.json({
                success: true,
                data: process,
                message: '获取服务流程详情成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '获取服务流程详情失败'
            });
        }
    }
    async createProcess(req, res) {
        try {
            const { name, description, steps } = req.body;
            if (!name || !steps || steps.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: '流程名称和步骤不能为空'
                });
            }
            const process = await ServiceProcessService_1.default.createProcess({
                name,
                description: description || '',
                steps
            });
            res.status(201).json({
                success: true,
                data: process,
                message: '创建服务流程成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '创建服务流程失败'
            });
        }
    }
    async updateProcess(req, res) {
        try {
            const { id } = req.params;
            const { name, description, steps } = req.body;
            if (!name || !steps || steps.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: '流程名称和步骤不能为空'
                });
            }
            const process = await ServiceProcessService_1.default.updateProcess(id, {
                name,
                description: description || '',
                steps
            });
            res.json({
                success: true,
                data: process,
                message: '更新服务流程成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '更新服务流程失败'
            });
        }
    }
    async toggleProcessStatus(req, res) {
        try {
            const { id } = req.params;
            const process = await ServiceProcessService_1.default.toggleProcessStatus(id);
            res.json({
                success: true,
                data: process,
                message: `服务流程已${process.status === 'active' ? '启用' : '禁用'}`
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '切换服务流程状态失败'
            });
        }
    }
    async deleteProcess(req, res) {
        try {
            const { id } = req.params;
            await ServiceProcessService_1.default.deleteProcess(id);
            res.json({
                success: true,
                message: '删除服务流程成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '删除服务流程失败'
            });
        }
    }
    async searchProcesses(req, res) {
        try {
            const { search } = req.query;
            const searchTerm = search;
            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: '搜索关键词不能为空'
                });
            }
            const processes = await ServiceProcessService_1.default.searchProcesses(searchTerm);
            res.json({
                success: true,
                data: processes,
                message: '搜索服务流程成功'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : '搜索服务流程失败'
            });
        }
    }
}
exports.ServiceProcessController = ServiceProcessController;
exports.default = new ServiceProcessController();
//# sourceMappingURL=ServiceProcessController.js.map