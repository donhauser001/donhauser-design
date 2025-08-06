"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationService = void 0;
const Quotation_1 = __importDefault(require("../models/Quotation"));
class QuotationService {
    async getAllQuotations() {
        return await Quotation_1.default.find().sort({ createTime: -1 });
    }
    async getQuotationById(id) {
        return await Quotation_1.default.findById(id);
    }
    async createQuotation(data) {
        if (data.isDefault) {
            await Quotation_1.default.updateMany({ isDefault: true }, { isDefault: false });
        }
        const quotation = new Quotation_1.default(data);
        return await quotation.save();
    }
    async updateQuotation(id, data) {
        if (data.isDefault) {
            await Quotation_1.default.updateMany({ _id: { $ne: id }, isDefault: true }, { isDefault: false });
        }
        return await Quotation_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async deleteQuotation(id) {
        const result = await Quotation_1.default.findByIdAndDelete(id);
        return !!result;
    }
    async toggleQuotationStatus(id) {
        const quotation = await Quotation_1.default.findById(id);
        if (!quotation) {
            return null;
        }
        quotation.status = quotation.status === 'active' ? 'inactive' : 'active';
        return await quotation.save();
    }
    async searchQuotations(searchText) {
        const regex = new RegExp(searchText, 'i');
        return await Quotation_1.default.find({
            name: regex
        }).sort({ createTime: -1 });
    }
    async getDefaultQuotation() {
        return await Quotation_1.default.findOne({ isDefault: true });
    }
}
exports.QuotationService = QuotationService;
exports.default = new QuotationService();
//# sourceMappingURL=QuotationService.js.map