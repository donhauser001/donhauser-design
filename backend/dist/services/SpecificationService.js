"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecificationService = void 0;
const Specification_1 = require("../models/Specification");
class SpecificationService {
    async getSpecifications(params) {
        const { page = 1, limit = 50, search, category, isDefault } = params;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category)
            filter.category = category;
        if (isDefault !== undefined)
            filter.isDefault = isDefault;
        const [specifications, total] = await Promise.all([
            Specification_1.Specification.find(filter)
                .sort({ isDefault: -1, createTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Specification_1.Specification.countDocuments(filter)
        ]);
        return { specifications, total };
    }
    async getSpecificationById(id) {
        return await Specification_1.Specification.findById(id).lean();
    }
    async createSpecification(specData) {
        const specification = new Specification_1.Specification({
            ...specData,
            updatedBy: specData.createdBy
        });
        return await specification.save();
    }
    async updateSpecification(id, updateData) {
        return await Specification_1.Specification.findByIdAndUpdate(id, { ...updateData, updateTime: new Date() }, { new: true });
    }
    async deleteSpecification(id) {
        await Specification_1.Specification.findByIdAndDelete(id);
    }
    async getDefaultSpecifications() {
        return await Specification_1.Specification.find({ isDefault: true })
            .sort({ createTime: -1 })
            .lean();
    }
    async setDefaultSpecification(id, isDefault, updatedBy) {
        if (isDefault) {
            await Specification_1.Specification.updateMany({ isDefault: true }, { isDefault: false, updatedBy, updateTime: new Date() });
        }
        return await Specification_1.Specification.findByIdAndUpdate(id, { isDefault, updatedBy, updateTime: new Date() }, { new: true });
    }
}
exports.SpecificationService = SpecificationService;
exports.default = new SpecificationService();
//# sourceMappingURL=SpecificationService.js.map