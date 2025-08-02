import { Department, CreateDepartmentRequest, UpdateDepartmentRequest, DepartmentQuery } from '../models/Department';
import { EnterpriseService } from './EnterpriseService';

// 模拟数据库
let departments: Department[] = [
  // 北京智创科技有限公司的部门
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

  // 上海未来数字科技有限公司的部门
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

  // 深圳创新设计有限公司的部门
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

  // 杭州云智科技有限公司的部门
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

export class DepartmentService {
  private enterpriseService = new EnterpriseService();

  // 获取部门列表
  async getDepartments(query: DepartmentQuery = {}): Promise<{ departments: Department[]; total: number }> {
    let filteredDepartments = [...departments];

    // 企业过滤
    if (query.enterpriseId) {
      filteredDepartments = filteredDepartments.filter(dept => dept.enterpriseId === query.enterpriseId);
    }

    // 上级部门过滤
    if (query.parentId !== undefined) {
      if (query.parentId === '') {
        // 查询顶级部门
        filteredDepartments = filteredDepartments.filter(dept => !dept.parentId);
      } else {
        filteredDepartments = filteredDepartments.filter(dept => dept.parentId === query.parentId);
      }
    }

    // 状态过滤
    if (query.status && query.status !== 'all') {
      filteredDepartments = filteredDepartments.filter(dept => dept.status === query.status);
    }

    const total = filteredDepartments.length;

    // 分页
    if (query.page && query.limit) {
      const start = (query.page - 1) * query.limit;
      const end = start + query.limit;
      filteredDepartments = filteredDepartments.slice(start, end);
    }

    return { departments: filteredDepartments, total };
  }

  // 根据ID获取部门
  async getDepartmentById(id: string): Promise<Department | null> {
    return departments.find(department => department.id === id) || null;
  }

  // 创建部门
  async createDepartment(departmentData: CreateDepartmentRequest): Promise<Department> {
    // 检查企业是否存在
    const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
    if (!enterprise) {
      throw new Error('企业不存在');
    }

    // 如果有上级部门，检查上级部门是否存在且属于同一企业
    if (departmentData.parentId) {
      const parentDepartment = await this.getDepartmentById(departmentData.parentId);
      if (!parentDepartment) {
        throw new Error('上级部门不存在');
      }
      if (parentDepartment.enterpriseId !== departmentData.enterpriseId) {
        throw new Error('上级部门与企业不匹配');
      }
    }

    const newDepartment: Department = {
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

  // 更新部门
  async updateDepartment(id: string, departmentData: UpdateDepartmentRequest): Promise<Department | null> {
    const departmentIndex = departments.findIndex(department => department.id === id);
    if (departmentIndex === -1) {
      return null;
    }

    const currentDepartment = departments[departmentIndex];

    // 如果更新企业ID，检查企业是否存在
    if (departmentData.enterpriseId) {
      const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
      if (!enterprise) {
        throw new Error('企业不存在');
      }
    }

    // 如果更新上级部门，检查上级部门是否存在且属于同一企业
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

    // 更新部门信息
    const updatedDepartment = {
      ...currentDepartment,
      ...departmentData,
      level: departmentData.parentId ? 2 : 1
    };

    // 如果更新了企业ID，需要更新企业名称
    if (departmentData.enterpriseId) {
      const enterprise = await this.enterpriseService.getEnterpriseById(departmentData.enterpriseId);
      updatedDepartment.enterpriseName = enterprise?.enterpriseName || '';
    }

    departments[departmentIndex] = updatedDepartment;
    return updatedDepartment;
  }

  // 删除部门
  async deleteDepartment(id: string): Promise<boolean> {
    const departmentIndex = departments.findIndex(department => department.id === id);
    if (departmentIndex === -1) {
      return false;
    }

    const department = departments[departmentIndex];

    // 检查是否有子部门
    const hasChildren = departments.some(dept => dept.parentId === id);
    if (hasChildren) {
      throw new Error('该部门下还有子部门，无法删除');
    }

    // 检查是否有员工
    if (department.employeeCount > 0) {
      throw new Error('该部门下还有员工，无法删除');
    }

    departments.splice(departmentIndex, 1);
    return true;
  }

  // 获取上级部门选项
  async getParentDepartmentOptions(enterpriseId: string): Promise<{ label: string; value: string }[]> {
    const { departments: deptList } = await this.getDepartments({ enterpriseId });
    return deptList
      .filter(dept => dept.level === 1)
      .map(dept => ({
        label: dept.name,
        value: dept.id
      }));
  }

  // 更新部门员工数量
  async updateEmployeeCount(departmentId: string, count: number): Promise<boolean> {
    const departmentIndex = departments.findIndex(department => department.id === departmentId);
    if (departmentIndex === -1) {
      return false;
    }

    departments[departmentIndex].employeeCount = count;
    return true;
  }

  // 切换部门状态
  async toggleDepartmentStatus(id: string): Promise<Department | null> {
    const departmentIndex = departments.findIndex(department => department.id === id);
    if (departmentIndex === -1) {
      return null;
    }

    departments[departmentIndex].status = departments[departmentIndex].status === 'active' ? 'inactive' : 'active';
    return departments[departmentIndex];
  }
} 