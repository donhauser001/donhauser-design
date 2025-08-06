"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const Department_1 = require("../models/Department");
const EnterpriseService_1 = require("./EnterpriseService");
class DepartmentService {
    constructor() {
        this.enterpriseService = new EnterpriseService_1.EnterpriseService();
    }
    async getDepartments(query = {}) {
        try {
            let filter = {};
            if (query.enterpriseId) {
                filter.enterpriseId = query.enterpriseId;
            }
            if (query.parentId) {
                filter.parentId = query.parentId;
            }
            if (query.status && query.status !== 'all') {
                filter.status = query.status;
            }
            const total = await Department_1.Department.countDocuments(filter);
            let departmentQuery = Department_1.Department.find(filter).sort({ level: 1, createTime: 1 });
            if (query.page && query.limit) {
                const skip = (query.page - 1) * query.limit;
                departmentQuery = departmentQuery.skip(skip).limit(query.limit);
            }
            const departments = await departmentQuery.lean();
            const departmentsWithId = departments.map(department => ({
                ...department,
                id: department._id.toString()
            }));
            return { departments: departmentsWithId, total };
        }
        catch (error) {
            throw new Error('获取部门列表失败');
        }
    }
    async getDepartmentById(id) {
        try {
            const department = await Department_1.Department.findById(id).lean();
            if (department) {
                return {
                    ...department,
                    id: department._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('获取部门信息失败');
        }
    }
    async createDepartment(departmentData) {
        try {
            const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
            if (!enterprise) {
                throw new Error('企业不存在');
            }
            let level = 1;
            if (departmentData.parentId) {
                const parentDepartment = await this.getDepartmentById(departmentData.parentId);
                if (!parentDepartment) {
                    throw new Error('父部门不存在');
                }
                level = parentDepartment.level + 1;
            }
            const newDepartment = new Department_1.Department({
                ...departmentData,
                enterpriseName: enterprise.enterpriseName,
                level,
                employeeCount: 0,
                createTime: new Date().toLocaleString()
            });
            const savedDepartment = await newDepartment.save();
            return {
                ...savedDepartment.toObject(),
                id: savedDepartment._id.toString()
            };
        }
        catch (error) {
            throw new Error('创建部门失败');
        }
    }
    async updateDepartment(id, departmentData) {
        try {
            if (departmentData.enterpriseId) {
                const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
                if (!enterprise) {
                    throw new Error('企业不存在');
                }
                departmentData.enterpriseName = enterprise.enterpriseName;
            }
            if (departmentData.parentId) {
                const parentDepartment = await this.getDepartmentById(departmentData.parentId);
                if (!parentDepartment) {
                    throw new Error('父部门不存在');
                }
                if (parentDepartment.id === id) {
                    throw new Error('不能将自己设为父部门');
                }
                const isChild = await this.isChildDepartment(id, departmentData.parentId);
                if (isChild) {
                    throw new Error('不能将子部门设为父部门');
                }
            }
            const updatedDepartment = await Department_1.Department.findByIdAndUpdate(id, departmentData, { new: true, runValidators: true }).lean();
            if (updatedDepartment) {
                return {
                    ...updatedDepartment,
                    id: updatedDepartment._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('更新部门失败');
        }
    }
    async deleteDepartment(id) {
        try {
            const childDepartments = await Department_1.Department.find({ parentId: id });
            if (childDepartments.length > 0) {
                throw new Error('该部门下还有子部门，无法删除');
            }
            const department = await Department_1.Department.findById(id);
            if (department && department.employeeCount > 0) {
                throw new Error('该部门下还有员工，无法删除');
            }
            const result = await Department_1.Department.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error('删除部门失败');
        }
    }
    async getParentDepartmentOptions(enterpriseId) {
        try {
            const departments = await Department_1.Department.find({
                enterpriseId,
                status: 'active'
            }).sort({ level: 1, name: 1 }).lean();
            return departments.map(dept => ({
                label: dept.name,
                value: dept._id.toString()
            }));
        }
        catch (error) {
            throw new Error('获取父部门选项失败');
        }
    }
    async updateEmployeeCount(departmentId, count) {
        try {
            await Department_1.Department.findByIdAndUpdate(departmentId, { employeeCount: count });
            return true;
        }
        catch (error) {
            throw new Error('更新员工数量失败');
        }
    }
    async toggleDepartmentStatus(id) {
        try {
            const department = await Department_1.Department.findById(id);
            if (!department) {
                return null;
            }
            department.status = department.status === 'active' ? 'inactive' : 'active';
            const updatedDepartment = await department.save();
            return {
                ...updatedDepartment.toObject(),
                id: updatedDepartment._id.toString()
            };
        }
        catch (error) {
            throw new Error('切换部门状态失败');
        }
    }
    async isChildDepartment(departmentId, parentId) {
        try {
            const parent = await Department_1.Department.findById(parentId);
            if (!parent) {
                return false;
            }
            if (parent.parentId === departmentId) {
                return true;
            }
            if (parent.parentId) {
                return await this.isChildDepartment(departmentId, parent.parentId);
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
}
exports.DepartmentService = DepartmentService;
//# sourceMappingURL=DepartmentService.js.map