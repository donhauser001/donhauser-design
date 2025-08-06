"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/donhauser');
        console.log('✅ MongoDB数据库连接成功');
    }
    catch (error) {
        console.error('❌ MongoDB数据库连接失败:', error);
        process.exit(1);
    }
};
const clearData = async () => {
    try {
        await User_1.default.deleteMany({});
        console.log('✅ 清空用户数据成功');
    }
    catch (error) {
        console.error('❌ 清空用户数据失败:', error);
    }
};
const testUsers = [
    {
        username: 'admin',
        password: 'admin123',
        email: 'admin@donhauser.com',
        phone: '13800138000',
        realName: '系统管理员',
        role: '超级管理员',
        department: '技术部',
        status: 'active',
        createTime: '2024-01-01',
        permissions: ['user:read', 'user:write', 'user:delete'],
        permissionGroups: ['admin']
    },
    {
        username: 'manager1',
        password: 'manager123',
        email: 'manager1@donhauser.com',
        phone: '13800138001',
        realName: '张经理',
        role: '项目经理',
        department: '项目管理部',
        status: 'active',
        createTime: '2024-01-02',
        permissions: ['project:read', 'project:write'],
        permissionGroups: ['manager']
    },
    {
        username: 'designer1',
        password: 'designer123',
        email: 'designer1@donhauser.com',
        phone: '13800138002',
        realName: '李设计师',
        role: '设计师',
        department: '设计部',
        status: 'active',
        createTime: '2024-01-03',
        permissions: ['design:read', 'design:write'],
        permissionGroups: ['designer']
    },
    {
        username: 'client1',
        password: 'client123',
        email: 'client1@example.com',
        phone: '13800138003',
        realName: '王客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-04',
        company: 'ABC科技有限公司',
        contactPerson: '王客户',
        address: '北京市朝阳区建国路88号',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client2',
        password: 'client123',
        email: 'client2@example.com',
        phone: '13800138004',
        realName: '赵客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-05',
        company: 'XYZ设计工作室',
        contactPerson: '赵客户',
        address: '上海市浦东新区陆家嘴金融中心',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client3',
        password: 'client123',
        email: 'client3@example.com',
        phone: '13800138005',
        realName: '孙客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-06',
        company: '创新科技集团',
        contactPerson: '孙客户',
        address: '深圳市南山区科技园',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client4',
        password: 'client123',
        email: 'client4@example.com',
        phone: '13800138006',
        realName: '李客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-07',
        company: '未来数字公司',
        contactPerson: '李客户',
        address: '广州市天河区珠江新城',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client5',
        password: 'client123',
        email: 'client5@example.com',
        phone: '13800138007',
        realName: '刘客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-08',
        company: '智慧解决方案',
        contactPerson: '刘客户',
        address: '杭州市西湖区文三路',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client6',
        password: 'client123',
        email: 'client6@example.com',
        phone: '13800138008',
        realName: '陈客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-09',
        company: '数字营销公司',
        contactPerson: '陈客户',
        address: '成都市高新区天府软件园',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client7',
        password: 'client123',
        email: 'client7@example.com',
        phone: '13800138009',
        realName: '周客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-10',
        company: '创意设计工作室',
        contactPerson: '周客户',
        address: '武汉市东湖新技术开发区',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client8',
        password: 'client123',
        email: 'client8@example.com',
        phone: '13800138010',
        realName: '吴客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-11',
        company: '互联网科技公司',
        contactPerson: '吴客户',
        address: '西安市高新区科技路',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client9',
        password: 'client123',
        email: 'client9@example.com',
        phone: '13800138011',
        realName: '郑客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-12',
        company: '软件开发公司',
        contactPerson: '郑客户',
        address: '南京市江宁区软件谷',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client10',
        password: 'client123',
        email: 'client10@example.com',
        phone: '13800138012',
        realName: '冯客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-13',
        company: '电子商务平台',
        contactPerson: '冯客户',
        address: '苏州市工业园区星湖街',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client11',
        password: 'client123',
        email: 'client11@example.com',
        phone: '13800138013',
        realName: '朱客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-14',
        company: '移动应用开发',
        contactPerson: '朱客户',
        address: '天津市滨海新区开发区',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client12',
        password: 'client123',
        email: 'client12@example.com',
        phone: '13800138014',
        realName: '何客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-15',
        company: '人工智能科技',
        contactPerson: '何客户',
        address: '重庆市渝北区两江新区',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client13',
        password: 'client123',
        email: 'client13@example.com',
        phone: '13800138015',
        realName: '高客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-16',
        company: '区块链技术公司',
        contactPerson: '高客户',
        address: '青岛市崂山区科技园',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client14',
        password: 'client123',
        email: 'client14@example.com',
        phone: '13800138016',
        realName: '林客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-17',
        company: '云计算服务商',
        contactPerson: '林客户',
        address: '大连市高新区软件园',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'client15',
        password: 'client123',
        email: 'client15@example.com',
        phone: '13800138017',
        realName: '罗客户',
        role: '客户',
        department: '客户部',
        status: 'active',
        createTime: '2024-01-18',
        company: '大数据分析公司',
        contactPerson: '罗客户',
        address: '厦门市软件园三期',
        shippingMethod: '快递',
        permissions: ['order:read'],
        permissionGroups: ['client']
    },
    {
        username: 'employee1',
        password: 'employee123',
        email: 'employee1@donhauser.com',
        phone: '13800138018',
        realName: '刘员工',
        role: '员工',
        department: '销售部',
        status: 'active',
        createTime: '2024-01-19',
        enterpriseName: 'Donhauser公司',
        departmentName: '销售部',
        position: '销售专员',
        permissions: ['sale:read', 'sale:write'],
        permissionGroups: ['employee']
    },
    {
        username: 'employee2',
        password: 'employee123',
        email: 'employee2@donhauser.com',
        phone: '13800138019',
        realName: '陈员工',
        role: '员工',
        department: '客服部',
        status: 'active',
        createTime: '2024-01-20',
        enterpriseName: 'Donhauser公司',
        departmentName: '客服部',
        position: '客服专员',
        permissions: ['service:read', 'service:write'],
        permissionGroups: ['employee']
    }
];
const insertData = async () => {
    try {
        for (const userData of testUsers) {
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
            const user = new User_1.default({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            console.log(`✅ 创建用户: ${userData.username}`);
        }
        console.log('✅ 所有用户数据插入成功');
    }
    catch (error) {
        console.error('❌ 插入用户数据失败:', error);
    }
};
const main = async () => {
    await connectDB();
    await clearData();
    await insertData();
    console.log('✅ 用户数据种子脚本执行完成');
    process.exit(0);
};
main().catch(console.error);
//# sourceMappingURL=seedUsers.js.map