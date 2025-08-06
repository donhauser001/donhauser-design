"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContractElement_1 = __importDefault(require("../models/ContractElement"));
class ContractElementService {
    async create(data) {
        const element = new ContractElement_1.default(data);
        return await element.save();
    }
    async update(id, data) {
        return await ContractElement_1.default.findByIdAndUpdate(id, { ...data, updateTime: new Date() }, { new: true, runValidators: true }).exec();
    }
    async delete(id) {
        const result = await ContractElement_1.default.findByIdAndDelete(id);
        return !!result;
    }
    async getById(id) {
        const element = await ContractElement_1.default.findById(id);
        if (element) {
            const elementObj = element.toObject();
            elementObj.createTime = element.createTime;
            elementObj.updateTime = element.updateTime;
            return elementObj;
        }
        return null;
    }
    async getList(query = {}) {
        const { page = 1, limit = 100, search, type, status } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (type && type !== 'all') {
            filter.type = type;
        }
        if (status && status !== 'all') {
            filter.status = status;
        }
        const [elements, total] = await Promise.all([
            ContractElement_1.default.find(filter)
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit),
            ContractElement_1.default.countDocuments(filter)
        ]);
        const formattedElements = elements.map(element => {
            const elementObj = element.toObject();
            elementObj.createTime = element.createTime;
            elementObj.updateTime = element.updateTime;
            return elementObj;
        });
        return {
            elements: formattedElements,
            total,
            page,
            limit
        };
    }
    async getActiveElements() {
        const elements = await ContractElement_1.default.find({ status: 'active' })
            .sort({ createTime: -1 });
        return elements.map(element => {
            const elementObj = element.toObject();
            elementObj.createTime = element.createTime;
            elementObj.updateTime = element.updateTime;
            return elementObj;
        });
    }
    async isNameExists(name, excludeId) {
        const filter = { name };
        if (excludeId) {
            filter._id = { $ne: excludeId };
        }
        const count = await ContractElement_1.default.countDocuments(filter);
        return count > 0;
    }
}
exports.default = new ContractElementService();
//# sourceMappingURL=ContractElementService.js.map