"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseService = void 0;
let enterprises = [
    {
        id: '1',
        enterpriseName: '北京智创科技有限公司',
        creditCode: '91110000123456789X',
        businessLicense: 'businessLicense-1754053738203-776983323.png',
        legalRepresentative: '陈志强',
        legalRepresentativeId: '110101198505151234',
        companyAddress: '北京市海淀区中关村大街1号',
        shippingAddress: '北京市海淀区中关村大街1号智创大厦15层',
        contactPerson: '张丽华',
        contactPhone: '13800138000',
        invoiceInfo: '公司名称：北京智创科技有限公司\n税号：91110000123456789X\n地址：北京市海淀区中关村大街1号\n开户行：中国银行北京中关村支行\n账号：1234567890123456789',
        bankName: '中国银行北京中关村支行',
        accountName: '北京智创科技有限公司',
        accountNumber: '1234567890123456789',
        status: 'active',
        createTime: '2024-01-15 09:30:00'
    },
    {
        id: '2',
        enterpriseName: '上海未来数字科技有限公司',
        creditCode: '91310000123456789Y',
        businessLicense: 'businessLicense-1754053842144-271071487.png',
        legalRepresentative: '李明轩',
        legalRepresentativeId: '310101198812081234',
        companyAddress: '上海市浦东新区张江高科技园区',
        shippingAddress: '上海市浦东新区张江高科技园区未来大厦8层',
        contactPerson: '王美玲',
        contactPhone: '13800138001',
        invoiceInfo: '公司名称：上海未来数字科技有限公司\n税号：91310000123456789Y\n地址：上海市浦东新区张江高科技园区\n开户行：工商银行上海张江支行\n账号：9876543210987654321',
        bankName: '工商银行上海张江支行',
        accountName: '上海未来数字科技有限公司',
        accountNumber: '9876543210987654321',
        status: 'active',
        createTime: '2024-02-20 14:15:00'
    },
    {
        id: '3',
        enterpriseName: '深圳创新设计有限公司',
        creditCode: '91440300123456789Z',
        businessLicense: '',
        legalRepresentative: '刘建华',
        legalRepresentativeId: '440301198203201234',
        companyAddress: '深圳市南山区科技园南区',
        shippingAddress: '深圳市南山区科技园南区创新大厦12层',
        contactPerson: '赵晓雯',
        contactPhone: '13800138002',
        invoiceInfo: '公司名称：深圳创新设计有限公司\n税号：91440300123456789Z\n地址：深圳市南山区科技园南区\n开户行：建设银行深圳科技园支行\n账号：1111222233334444',
        bankName: '建设银行深圳科技园支行',
        accountName: '深圳创新设计有限公司',
        accountNumber: '1111222233334444',
        status: 'active',
        createTime: '2024-03-10 11:45:00'
    },
    {
        id: '4',
        enterpriseName: '杭州云智科技有限公司',
        creditCode: '91330000123456789A',
        businessLicense: '',
        legalRepresentative: '孙志远',
        legalRepresentativeId: '330101198907121234',
        companyAddress: '杭州市西湖区文三路',
        shippingAddress: '杭州市西湖区文三路云智大厦6层',
        contactPerson: '周雅琴',
        contactPhone: '13800138003',
        invoiceInfo: '公司名称：杭州云智科技有限公司\n税号：91330000123456789A\n地址：杭州市西湖区文三路\n开户行：招商银行杭州西湖支行\n账号：5555666677778888',
        bankName: '招商银行杭州西湖支行',
        accountName: '杭州云智科技有限公司',
        accountNumber: '5555666677778888',
        status: 'active',
        createTime: '2024-04-05 16:20:00'
    }
];
class EnterpriseService {
    async getEnterprises(query = {}) {
        let filteredEnterprises = [...enterprises];
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            filteredEnterprises = filteredEnterprises.filter(enterprise => enterprise.enterpriseName.toLowerCase().includes(searchLower) ||
                enterprise.creditCode.toLowerCase().includes(searchLower) ||
                enterprise.legalRepresentative.toLowerCase().includes(searchLower) ||
                enterprise.contactPerson.toLowerCase().includes(searchLower));
        }
        if (query.status && query.status !== 'all') {
            filteredEnterprises = filteredEnterprises.filter(enterprise => enterprise.status === query.status);
        }
        const total = filteredEnterprises.length;
        if (query.page && query.limit) {
            const start = (query.page - 1) * query.limit;
            const end = start + query.limit;
            filteredEnterprises = filteredEnterprises.slice(start, end);
        }
        return { enterprises: filteredEnterprises, total };
    }
    async getEnterpriseById(id) {
        return enterprises.find(enterprise => enterprise.id === id) || null;
    }
    async createEnterprise(enterpriseData) {
        const existingEnterprise = enterprises.find(enterprise => enterprise.creditCode === enterpriseData.creditCode);
        if (existingEnterprise) {
            throw new Error('统一社会信用代码已存在');
        }
        const newEnterprise = {
            id: Date.now().toString(),
            ...enterpriseData,
            createTime: new Date().toLocaleString()
        };
        enterprises.push(newEnterprise);
        return newEnterprise;
    }
    async updateEnterprise(id, enterpriseData) {
        const enterpriseIndex = enterprises.findIndex(enterprise => enterprise.id === id);
        if (enterpriseIndex === -1) {
            return null;
        }
        if (enterpriseData.creditCode) {
            const existingEnterprise = enterprises.find(enterprise => enterprise.creditCode === enterpriseData.creditCode && enterprise.id !== id);
            if (existingEnterprise) {
                throw new Error('统一社会信用代码已存在');
            }
        }
        enterprises[enterpriseIndex] = { ...enterprises[enterpriseIndex], ...enterpriseData };
        return enterprises[enterpriseIndex];
    }
    async deleteEnterprise(id) {
        const enterpriseIndex = enterprises.findIndex(enterprise => enterprise.id === id);
        if (enterpriseIndex === -1) {
            return false;
        }
        enterprises.splice(enterpriseIndex, 1);
        return true;
    }
    async toggleEnterpriseStatus(id) {
        const enterpriseIndex = enterprises.findIndex(enterprise => enterprise.id === id);
        if (enterpriseIndex === -1) {
            return null;
        }
        enterprises[enterpriseIndex].status = enterprises[enterpriseIndex].status === 'active' ? 'inactive' : 'active';
        return enterprises[enterpriseIndex];
    }
}
exports.EnterpriseService = EnterpriseService;
//# sourceMappingURL=EnterpriseService.js.map