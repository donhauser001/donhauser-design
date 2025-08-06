"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const Client_1 = __importDefault(require("../models/Client"));
class ClientService {
    static async getClients(query = {}) {
        try {
            let filter = {};
            if (query.search) {
                filter.name = { $regex: query.search, $options: 'i' };
            }
            if (query.status && query.status !== 'all') {
                filter.status = query.status;
            }
            if (query.category && query.category !== 'all') {
                filter.category = query.category;
            }
            const total = await Client_1.default.countDocuments(filter);
            let queryBuilder = Client_1.default.find(filter).sort({ createTime: -1 });
            if (query.page && query.limit) {
                const skip = (query.page - 1) * query.limit;
                queryBuilder = queryBuilder.skip(skip).limit(query.limit);
            }
            const data = await queryBuilder.exec();
            return { data, total };
        }
        catch (error) {
            console.error('获取客户列表失败:', error);
            throw error;
        }
    }
    static async getClientById(id) {
        try {
            return await Client_1.default.findById(id);
        }
        catch (error) {
            console.error('获取客户信息失败:', error);
            throw error;
        }
    }
    static async createClient(clientData) {
        try {
            const newClient = new Client_1.default({
                ...clientData,
                createTime: new Date().toISOString().split('T')[0],
                updateTime: new Date().toISOString().split('T')[0]
            });
            return await newClient.save();
        }
        catch (error) {
            console.error('创建客户失败:', error);
            throw error;
        }
    }
    static async updateClient(id, clientData) {
        try {
            const updatedClient = await Client_1.default.findByIdAndUpdate(id, {
                ...clientData,
                updateTime: new Date().toISOString().split('T')[0]
            }, { new: true });
            return updatedClient;
        }
        catch (error) {
            console.error('更新客户失败:', error);
            throw error;
        }
    }
    static async deleteClient(id) {
        try {
            const result = await Client_1.default.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            console.error('删除客户失败:', error);
            throw error;
        }
    }
    static async addClientFile(clientId, fileInfo) {
        try {
            const result = await Client_1.default.findByIdAndUpdate(clientId, {
                $push: { files: fileInfo },
                updateTime: new Date().toISOString().split('T')[0]
            });
            return !!result;
        }
        catch (error) {
            console.error('添加客户文件失败:', error);
            throw error;
        }
    }
    static async removeClientFile(clientId, filePath) {
        try {
            const result = await Client_1.default.findByIdAndUpdate(clientId, {
                $pull: { files: { path: filePath } },
                updateTime: new Date().toISOString().split('T')[0]
            });
            return !!result;
        }
        catch (error) {
            console.error('删除客户文件失败:', error);
            throw error;
        }
    }
}
exports.ClientService = ClientService;
//# sourceMappingURL=ClientService.js.map