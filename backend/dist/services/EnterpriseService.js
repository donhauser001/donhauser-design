"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseService = void 0;
const Enterprise_1 = require("../models/Enterprise");
class EnterpriseService {
    async getEnterprises(query = {}) {
        try {
            let filter = {};
            if (query.search) {
                filter.$or = [
                    { enterpriseName: { $regex: query.search, $options: 'i' } },
                    { creditCode: { $regex: query.search, $options: 'i' } },
                    { legalRepresentative: { $regex: query.search, $options: 'i' } },
                    { contactPerson: { $regex: query.search, $options: 'i' } }
                ];
            }
            if (query.status && query.status !== 'all') {
                filter.status = query.status;
            }
            const total = await Enterprise_1.Enterprise.countDocuments(filter);
            let enterpriseQuery = Enterprise_1.Enterprise.find(filter).sort({ createTime: -1 });
            if (query.page && query.limit) {
                const skip = (query.page - 1) * query.limit;
                enterpriseQuery = enterpriseQuery.skip(skip).limit(query.limit);
            }
            const enterprises = await enterpriseQuery.lean();
            const enterprisesWithId = enterprises.map(enterprise => ({
                ...enterprise,
                id: enterprise._id.toString()
            }));
            return { enterprises: enterprisesWithId, total };
        }
        catch (error) {
            throw new Error('获取企业列表失败');
        }
    }
    async getEnterpriseById(id) {
        try {
            const enterprise = await Enterprise_1.Enterprise.findById(id).lean();
            if (enterprise) {
                return {
                    ...enterprise,
                    id: enterprise._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('获取企业信息失败');
        }
    }
    async createEnterprise(enterpriseData) {
        try {
            const existingEnterprise = await Enterprise_1.Enterprise.findOne({ creditCode: enterpriseData.creditCode });
            if (existingEnterprise) {
                throw new Error('统一社会信用代码已存在');
            }
            const newEnterprise = new Enterprise_1.Enterprise({
                ...enterpriseData,
                createTime: new Date().toLocaleString()
            });
            const savedEnterprise = await newEnterprise.save();
            return {
                ...savedEnterprise.toObject(),
                id: savedEnterprise._id.toString()
            };
        }
        catch (error) {
            throw new Error('创建企业失败');
        }
    }
    async updateEnterprise(id, enterpriseData) {
        try {
            if (enterpriseData.creditCode) {
                const existingEnterprise = await Enterprise_1.Enterprise.findOne({
                    creditCode: enterpriseData.creditCode,
                    _id: { $ne: id }
                });
                if (existingEnterprise) {
                    throw new Error('统一社会信用代码已存在');
                }
            }
            const updatedEnterprise = await Enterprise_1.Enterprise.findByIdAndUpdate(id, enterpriseData, { new: true, runValidators: true }).lean();
            if (updatedEnterprise) {
                return {
                    ...updatedEnterprise,
                    id: updatedEnterprise._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('更新企业失败');
        }
    }
    async deleteEnterprise(id) {
        try {
            const result = await Enterprise_1.Enterprise.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error('删除企业失败');
        }
    }
    async toggleEnterpriseStatus(id) {
        try {
            const enterprise = await Enterprise_1.Enterprise.findById(id);
            if (!enterprise) {
                return null;
            }
            enterprise.status = enterprise.status === 'active' ? 'inactive' : 'active';
            const updatedEnterprise = await enterprise.save();
            return {
                ...updatedEnterprise.toObject(),
                id: updatedEnterprise._id.toString()
            };
        }
        catch (error) {
            throw new Error('切换企业状态失败');
        }
    }
}
exports.EnterpriseService = EnterpriseService;
//# sourceMappingURL=EnterpriseService.js.map