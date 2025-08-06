"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServicePricing_1 = __importDefault(require("../models/ServicePricing"));
const Quotation_1 = __importDefault(require("../models/Quotation"));
const Client_1 = __importDefault(require("../models/Client"));
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
const quickSetup = async () => {
    try {
        console.log('\n=== 开始快速设置数据 ===');
        console.log('\n1. 创建服务定价数据...');
        const servicePricingData = [
            {
                serviceName: '网站设计',
                alias: 'Web Design',
                categoryId: 'web_design',
                categoryName: '网站设计',
                unitPrice: 5000,
                unit: '个',
                priceDescription: '企业官网设计，包含响应式布局',
                link: 'https://example.com/web-design',
                pricingPolicyIds: ['policy_001'],
                pricingPolicyNames: ['新客户优惠'],
                status: 'active'
            },
            {
                serviceName: '移动应用开发',
                alias: 'Mobile App',
                categoryId: 'mobile_dev',
                categoryName: '移动开发',
                unitPrice: 15000,
                unit: '个',
                priceDescription: 'iOS和Android双平台应用开发',
                link: 'https://example.com/mobile-app',
                pricingPolicyIds: ['policy_001'],
                pricingPolicyNames: ['新客户优惠'],
                status: 'active'
            },
            {
                serviceName: '电商平台开发',
                alias: 'E-commerce',
                categoryId: 'ecommerce',
                categoryName: '电商开发',
                unitPrice: 25000,
                unit: '个',
                priceDescription: '完整的电商解决方案',
                link: 'https://example.com/ecommerce',
                pricingPolicyIds: ['policy_002'],
                pricingPolicyNames: ['批量折扣'],
                status: 'active'
            }
        ];
        await ServicePricing_1.default.deleteMany({});
        const services = [];
        for (const serviceData of servicePricingData) {
            const service = new ServicePricing_1.default(serviceData);
            const savedService = await service.save();
            services.push(savedService);
            console.log(`✅ 创建服务定价: ${serviceData.serviceName}`);
        }
        console.log('\n2. 创建报价单数据...');
        await Quotation_1.default.deleteMany({});
        const quotationData = {
            name: '标准网站建设套餐',
            status: 'active',
            description: '包含企业官网设计、响应式布局、SEO优化等核心服务',
            isDefault: true,
            selectedServices: services.map(service => service._id.toString()),
            validUntil: new Date('2025-12-31')
        };
        const quotation = new Quotation_1.default(quotationData);
        const savedQuotation = await quotation.save();
        console.log(`✅ 创建报价单: ${quotationData.name}`);
        console.log(`   关联服务数量: ${savedQuotation.selectedServices.length}`);
        console.log('\n3. 更新客户数据...');
        const clients = await Client_1.default.find({}).limit(3);
        for (const client of clients) {
            client.quotationId = savedQuotation._id.toString();
            await client.save();
            console.log(`✅ 为客户 ${client.name} 关联报价单`);
        }
        console.log('\n=== 快速设置完成 ===');
        console.log(`✅ 创建了 ${services.length} 个服务定价`);
        console.log(`✅ 创建了 1 个报价单`);
        console.log(`✅ 为 ${clients.length} 个客户关联了报价单`);
    }
    catch (error) {
        console.error('快速设置失败:', error);
    }
};
const main = async () => {
    await connectDB();
    await quickSetup();
    console.log('\n✅ 快速设置完成');
    process.exit(0);
};
main().catch(console.error);
//# sourceMappingURL=quickSetup.js.map