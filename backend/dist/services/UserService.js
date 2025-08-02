"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
let users = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123',
        email: 'admin@company.com',
        phone: '13800138000',
        realName: '超级管理员',
        role: '超级管理员',
        department: '系统管理',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-01-15 14:30:00',
        enterpriseId: '1',
        enterpriseName: 'ABC设计有限公司',
        departmentId: 'dept0',
        departmentName: '系统管理',
        position: '超级管理员',
        company: '',
        contactPerson: '',
        address: '',
        shippingMethod: '',
        description: '系统超级管理员，拥有所有权限',
        permissions: ['all'],
        permissionGroups: []
    },
    {
        id: '2',
        username: 'manager',
        password: 'manager123',
        email: 'manager@company.com',
        phone: '13800138001',
        realName: '项目经理',
        role: '项目经理',
        department: '项目管理部',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-01-15 16:20:00',
        enterpriseId: '1',
        enterpriseName: 'ABC设计有限公司',
        departmentId: 'dept1',
        departmentName: '设计部',
        position: '项目经理',
        company: '',
        contactPerson: '',
        address: '',
        shippingMethod: '',
        description: '负责项目管理和客户协调',
        permissions: ['dashboard:view', 'projects:view', 'projects:create', 'projects:edit', 'clients:view', 'clients:create', 'clients:edit'],
        permissionGroups: ['2']
    },
    {
        id: '3',
        username: 'designer',
        password: 'designer123',
        email: 'designer@company.com',
        phone: '13800138002',
        realName: '设计师',
        role: '设计师',
        department: '设计部',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-01-15 18:45:00',
        enterpriseId: '1',
        enterpriseName: 'ABC设计有限公司',
        departmentId: 'dept1',
        departmentName: '设计部',
        position: 'UI设计师',
        company: '',
        contactPerson: '',
        address: '',
        shippingMethod: '',
        description: '负责UI设计和用户体验',
        permissions: ['dashboard:view', 'projects:view', 'clients:view'],
        permissionGroups: []
    },
    {
        id: '4',
        username: 'client001',
        password: 'client123',
        email: 'client@abc.com',
        phone: '13800138003',
        realName: '客户A',
        role: '客户',
        department: '外部客户',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-01-15 12:15:00',
        enterpriseId: '',
        enterpriseName: '',
        departmentId: '',
        departmentName: '',
        position: '',
        company: 'ABC公司',
        contactPerson: '张三',
        address: '北京市朝阳区',
        shippingMethod: '北京市朝阳区ABC大厦15层，收件人：张三，电话：13800138003',
        description: '重要客户，经常有项目合作',
        permissions: ['dashboard:view', 'projects:view'],
        permissionGroups: []
    },
    {
        id: '5',
        username: 'employee001',
        password: 'employee123',
        email: 'employee@abc.com',
        phone: '13800138004',
        realName: '员工A',
        role: '员工',
        department: '设计部',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-01-15 20:30:00',
        enterpriseId: '1',
        enterpriseName: 'ABC设计有限公司',
        departmentId: 'dept1',
        departmentName: '设计部',
        position: 'UI设计师',
        company: '',
        contactPerson: '',
        address: '',
        shippingMethod: '',
        description: '新入职员工，正在熟悉工作流程',
        permissions: ['dashboard:view', 'projects:view', 'clients:view'],
        permissionGroups: []
    },
    {
        id: '6',
        username: 'finance001',
        password: 'finance123',
        email: 'finance@company.com',
        phone: '13800138005',
        realName: '财务专员',
        role: '员工',
        department: '财务部',
        status: 'active',
        createTime: '2024-01-02 09:00:00',
        lastLogin: '2024-01-15 17:30:00',
        enterpriseId: '1',
        enterpriseName: 'ABC设计有限公司',
        departmentId: 'dept2',
        departmentName: '财务部',
        position: '财务专员',
        company: '',
        contactPerson: '',
        address: '',
        shippingMethod: '',
        description: '负责公司财务管理和账目处理',
        permissions: ['dashboard:view', 'finance:view', 'finance:order:create', 'finance:order:edit', 'finance:invoice:view', 'finance:invoice:create'],
        permissionGroups: ['4']
    },
    {
        id: '7',
        username: 'hr001',
        password: 'hr123',
        email: 'hr@company.com',
        phone: '13800138006',
        realName: '人事专员',
        role: '员工',
        department: '人事部',
        status: 'active',
        createTime: '2024-01-02 10:00:00',
        lastLogin: '2024-01-15 16:45:00',
        enterpriseId: '1',
        enterpriseName: 'ABC设计有限公司',
        departmentId: 'dept3',
        departmentName: '人事部',
        position: '人事专员',
        company: '',
        contactPerson: '',
        address: '',
        shippingMethod: '',
        description: '负责人力资源管理和员工关系',
        permissions: ['dashboard:view', 'users:view', 'users:create', 'users:edit', 'organization:view'],
        permissionGroups: ['6']
    },
    {
        id: '8',
        username: 'client002',
        password: 'client456',
        email: 'client2@xyz.com',
        phone: '13800138007',
        realName: '客户B',
        role: '客户',
        department: '外部客户',
        status: 'active',
        createTime: '2024-01-03 14:00:00',
        lastLogin: '2024-01-15 11:20:00',
        enterpriseId: '',
        enterpriseName: '',
        departmentId: '',
        departmentName: '',
        position: '',
        company: 'XYZ科技公司',
        contactPerson: '李四',
        address: '上海市浦东新区',
        shippingMethod: '上海市浦东新区陆家嘴金融中心，收件人：李四，电话：13800138007',
        description: '新客户，有潜在合作机会',
        permissions: ['dashboard:view', 'projects:view'],
        permissionGroups: []
    }
];
class UserService {
    async getUsers(query = {}) {
        let filteredUsers = [...users];
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(searchLower) ||
                user.realName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.phone.includes(searchLower) ||
                user.company?.toLowerCase().includes(searchLower) ||
                user.enterpriseName?.toLowerCase().includes(searchLower));
        }
        if (query.role && query.role !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.role === query.role);
        }
        if (query.status && query.status !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.status === query.status);
        }
        if (query.department && query.department !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.department === query.department);
        }
        const total = filteredUsers.length;
        if (query.page && query.limit) {
            const start = (query.page - 1) * query.limit;
            const end = start + query.limit;
            filteredUsers = filteredUsers.slice(start, end);
        }
        return { users: filteredUsers, total };
    }
    async getUserById(id) {
        return users.find(user => user.id === id) || null;
    }
    async getUserByUsername(username) {
        return users.find(user => user.username === username) || null;
    }
    async createUser(userData) {
        const existingUser = await this.getUserByUsername(userData.username);
        if (existingUser) {
            throw new Error('用户名已存在');
        }
        const existingEmail = users.find(user => user.email === userData.email);
        if (existingEmail) {
            throw new Error('邮箱已存在');
        }
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createTime: new Date().toLocaleString(),
            permissions: userData.permissions || [],
            permissionGroups: userData.permissionGroups || []
        };
        users.push(newUser);
        return newUser;
    }
    async updateUser(id, userData) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return null;
        }
        if (userData.username) {
            const existingUser = users.find(user => user.username === userData.username && user.id !== id);
            if (existingUser) {
                throw new Error('用户名已存在');
            }
        }
        if (userData.email) {
            const existingEmail = users.find(user => user.email === userData.email && user.id !== id);
            if (existingEmail) {
                throw new Error('邮箱已存在');
            }
        }
        users[userIndex] = { ...users[userIndex], ...userData };
        return users[userIndex];
    }
    async deleteUser(id) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return false;
        }
        const user = users[userIndex];
        if (user.role === '超级管理员') {
            throw new Error('超级管理员不能删除');
        }
        users.splice(userIndex, 1);
        return true;
    }
    async resetPassword(id, passwordData) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return false;
        }
        users[userIndex].password = passwordData.newPassword;
        return true;
    }
    async updateUserPermissions(id, permissionData) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return null;
        }
        users[userIndex].permissions = permissionData.permissions;
        users[userIndex].permissionGroups = permissionData.permissionGroups;
        return users[userIndex];
    }
    async toggleUserStatus(id) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return null;
        }
        const user = users[userIndex];
        if (user.role === '超级管理员') {
            throw new Error('超级管理员状态不能修改');
        }
        users[userIndex].status = user.status === 'active' ? 'inactive' : 'active';
        return users[userIndex];
    }
    async getAllUsers() {
        return users;
    }
    async isUsernameExists(username) {
        return users.some(user => user.username === username);
    }
    async isEmailExists(email) {
        return users.some(user => user.email === email);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map