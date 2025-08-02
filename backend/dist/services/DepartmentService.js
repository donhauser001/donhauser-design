"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const EnterpriseService_1 = require("./EnterpriseService");
let departments = [
    {
        id: 'dept1',
        name: '技术研发部',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 'dept2',
        name: '产品设计部',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 'dept3',
        name: '市场营销部',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 'dept4',
        name: '人力资源部',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 'dept5',
        name: '财务部',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-15 10:00:00'
    },
    {
        id: 'dept6',
        name: '前端开发组',
        parentId: 'dept1',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-20 14:30:00'
    },
    {
        id: 'dept7',
        name: '后端开发组',
        parentId: 'dept1',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-20 14:30:00'
    },
    {
        id: 'dept8',
        name: 'UI设计组',
        parentId: 'dept2',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-20 14:30:00'
    },
    {
        id: 'dept9',
        name: '产品策划组',
        parentId: 'dept2',
        enterpriseId: '1',
        enterpriseName: '北京智创科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-01-20 14:30:00'
    },
    {
        id: 'dept10',
        name: '研发中心',
        enterpriseId: '2',
        enterpriseName: '上海未来数字科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-02-20 15:00:00'
    },
    {
        id: 'dept11',
        name: '销售部',
        enterpriseId: '2',
        enterpriseName: '上海未来数字科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-02-20 15:00:00'
    },
    {
        id: 'dept12',
        name: '运营部',
        enterpriseId: '2',
        enterpriseName: '上海未来数字科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-02-20 15:00:00'
    },
    {
        id: 'dept13',
        name: '人工智能组',
        parentId: 'dept10',
        enterpriseId: '2',
        enterpriseName: '上海未来数字科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-02-25 09:15:00'
    },
    {
        id: 'dept14',
        name: '大数据组',
        parentId: 'dept10',
        enterpriseId: '2',
        enterpriseName: '上海未来数字科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-02-25 09:15:00'
    },
    {
        id: 'dept15',
        name: '设计部',
        enterpriseId: '3',
        enterpriseName: '深圳创新设计有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-03-10 12:00:00'
    },
    {
        id: 'dept16',
        name: '工程部',
        enterpriseId: '3',
        enterpriseName: '深圳创新设计有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-03-10 12:00:00'
    },
    {
        id: 'dept17',
        name: '项目管理部',
        enterpriseId: '3',
        enterpriseName: '深圳创新设计有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-03-10 12:00:00'
    },
    {
        id: 'dept18',
        name: '工业设计组',
        parentId: 'dept15',
        enterpriseId: '3',
        enterpriseName: '深圳创新设计有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-03-15 16:45:00'
    },
    {
        id: 'dept19',
        name: '平面设计组',
        parentId: 'dept15',
        enterpriseId: '3',
        enterpriseName: '深圳创新设计有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-03-15 16:45:00'
    },
    {
        id: 'dept20',
        name: '技术部',
        enterpriseId: '4',
        enterpriseName: '杭州云智科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-04-05 17:00:00'
    },
    {
        id: 'dept21',
        name: '商务部',
        enterpriseId: '4',
        enterpriseName: '杭州云智科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-04-05 17:00:00'
    },
    {
        id: 'dept22',
        name: '客户服务部',
        enterpriseId: '4',
        enterpriseName: '杭州云智科技有限公司',
        level: 1,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-04-05 17:00:00'
    },
    {
        id: 'dept23',
        name: '云计算组',
        parentId: 'dept20',
        enterpriseId: '4',
        enterpriseName: '杭州云智科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-04-10 10:30:00'
    },
    {
        id: 'dept24',
        name: '移动开发组',
        parentId: 'dept20',
        enterpriseId: '4',
        enterpriseName: '杭州云智科技有限公司',
        level: 2,
        employeeCount: 0,
        status: 'active',
        createTime: '2024-04-10 10:30:00'
    }
];
class DepartmentService {
    constructor() {
        this.enterpriseService = new EnterpriseService_1.EnterpriseService();
    }
    async getDepartments(query = {}) {
        let filteredDepartments = [...departments];
        if (query.enterpriseId) {
            filteredDepartments = filteredDepartments.filter(dept => dept.enterpriseId === query.enterpriseId);
        }
        if (query.parentId !== undefined) {
            if (query.parentId === '') {
                filteredDepartments = filteredDepartments.filter(dept => !dept.parentId);
            }
            else {
                filteredDepartments = filteredDepartments.filter(dept => dept.parentId === query.parentId);
            }
        }
        if (query.status && query.status !== 'all') {
            filteredDepartments = filteredDepartments.filter(dept => dept.status === query.status);
        }
        const total = filteredDepartments.length;
        if (query.page && query.limit) {
            const start = (query.page - 1) * query.limit;
            const end = start + query.limit;
            filteredDepartments = filteredDepartments.slice(start, end);
        }
        return { departments: filteredDepartments, total };
    }
    async getDepartmentById(id) {
        return departments.find(department => department.id === id) || null;
    }
    async createDepartment(departmentData) {
        const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
        if (!enterprise) {
            throw new Error('企业不存在');
        }
        if (departmentData.parentId) {
            const parentDepartment = await this.getDepartmentById(departmentData.parentId);
            if (!parentDepartment) {
                throw new Error('上级部门不存在');
            }
            if (parentDepartment.enterpriseId !== departmentData.enterpriseId) {
                throw new Error('上级部门与企业不匹配');
            }
        }
        const newDepartment = {
            id: `dept${Date.now()}`,
            ...departmentData,
            enterpriseName: enterprise.enterpriseName,
            level: departmentData.parentId ? 2 : 1,
            employeeCount: 0,
            createTime: new Date().toLocaleString()
        };
        departments.push(newDepartment);
        return newDepartment;
    }
    async updateDepartment(id, departmentData) {
        const departmentIndex = departments.findIndex(department => department.id === id);
        if (departmentIndex === -1) {
            return null;
        }
        const currentDepartment = departments[departmentIndex];
        if (departmentData.enterpriseId) {
            const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
            if (!enterprise) {
                throw new Error('企业不存在');
            }
        }
        if (departmentData.parentId !== undefined) {
            if (departmentData.parentId) {
                const parentDepartment = await this.getDepartmentById(departmentData.parentId);
                if (!parentDepartment) {
                    throw new Error('上级部门不存在');
                }
                const targetEnterpriseId = departmentData.enterpriseId || currentDepartment.enterpriseId;
                if (parentDepartment.enterpriseId !== targetEnterpriseId) {
                    throw new Error('上级部门与企业不匹配');
                }
            }
        }
        const updatedDepartment = {
            ...currentDepartment,
            ...departmentData,
            level: departmentData.parentId ? 2 : 1
        };
        if (departmentData.enterpriseId) {
            const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
            updatedDepartment.enterpriseName = enterprise?.enterpriseName || '';
        }
        departments[departmentIndex] = updatedDepartment;
        return updatedDepartment;
    }
    async deleteDepartment(id) {
        const departmentIndex = departments.findIndex(department => department.id === id);
        if (departmentIndex === -1) {
            return false;
        }
        const department = departments[departmentIndex];
        const hasChildren = departments.some(dept => dept.parentId === id);
        if (hasChildren) {
            throw new Error('该部门下还有子部门，无法删除');
        }
        if (department.employeeCount > 0) {
            throw new Error('该部门下还有员工，无法删除');
        }
        departments.splice(departmentIndex, 1);
        return true;
    }
    async getParentDepartmentOptions(enterpriseId) {
        const { departments: deptList } = await this.getDepartments({ enterpriseId });
        return deptList
            .filter(dept => dept.level === 1)
            .map(dept => ({
            label: dept.name,
            value: dept.id
        }));
    }
    async updateEmployeeCount(departmentId, count) {
        const departmentIndex = departments.findIndex(department => department.id === departmentId);
        if (departmentIndex === -1) {
            return false;
        }
        departments[departmentIndex].employeeCount = count;
        return true;
    }
    async toggleDepartmentStatus(id) {
        const departmentIndex = departments.findIndex(department => department.id === id);
        if (departmentIndex === -1) {
            return null;
        }
        departments[departmentIndex].status = departments[departmentIndex].status === 'active' ? 'inactive' : 'active';
        return departments[departmentIndex];
    }
}
exports.DepartmentService = DepartmentService;
//# sourceMappingURL=DepartmentService.js.map