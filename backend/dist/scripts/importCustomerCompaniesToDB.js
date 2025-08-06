"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/donhauser');
        console.log('数据库连接成功');
    }
    catch (error) {
        console.error('数据库连接失败:', error);
        process.exit(1);
    }
};
const loadCustomerCompanies = () => {
    try {
        const filePath = path_1.default.join(__dirname, '../../../customer_data_cleaned.json');
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    catch (error) {
        console.error('读取客户公司数据失败:', error);
        return [];
    }
};
const importCompaniesToDB = async (companies) => {
    try {
        console.log(`开始导入 ${companies.length} 个客户公司到数据库...`);
        let successCount = 0;
        let errorCount = 0;
        for (const company of companies) {
            try {
                const existingCompany = await User_1.default.findOne({
                    role: '客户',
                    company: company.customer_name
                });
                if (existingCompany) {
                    console.log(`跳过已存在公司: ${company.customer_name}`);
                    continue;
                }
                let username = company.customer_name.toLowerCase()
                    .replace(/[^\w\u4e00-\u9fa5]/g, '')
                    .substring(0, 20);
                let counter = 1;
                let finalUsername = username;
                while (await User_1.default.findOne({ username: finalUsername })) {
                    finalUsername = `${username}${counter}`;
                    counter++;
                }
                const timestamp = Date.now();
                const randomSuffix = Math.floor(Math.random() * 1000);
                const email = `company_${timestamp}_${randomSuffix}@donhauser.com`;
                const companyUserData = {
                    username: finalUsername,
                    password: '123456',
                    email: email,
                    phone: '00000000000',
                    realName: company.customer_name,
                    role: '客户',
                    department: '客户部',
                    status: 'active',
                    company: company.customer_name,
                    contactPerson: company.customer_name,
                    address: company.customer_address || undefined,
                    shippingMethod: company.customer_address || undefined,
                    description: company.invoice_info || company.customer_summary || undefined,
                    createTime: company.created_at ? company.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]
                };
                const newCompanyUser = new User_1.default(companyUserData);
                await newCompanyUser.save();
                successCount++;
                if (successCount % 10 === 0) {
                    console.log(`已成功导入 ${successCount} 个公司...`);
                }
            }
            catch (error) {
                errorCount++;
                console.error(`导入失败 ${company.customer_name}:`, error);
            }
        }
        console.log(`\n公司导入完成！`);
        console.log(`成功: ${successCount} 个`);
        console.log(`失败: ${errorCount} 个`);
        console.log(`总计: ${companies.length} 个`);
    }
    catch (error) {
        console.error('导入过程中发生错误:', error);
    }
};
const displayImportedCompanies = async () => {
    try {
        const companies = await User_1.default.find({
            role: '客户',
            company: { $exists: true, $ne: null, $nin: ['', undefined] }
        }).select('realName company address description createTime');
        console.log('\n=== 已导入的客户公司 ===\n');
        companies.forEach((company, index) => {
            console.log(`${index + 1}. ${company.realName}`);
            console.log(`   公司名称: ${company.company}`);
            console.log(`   地址: ${company.address || '无地址'}`);
            console.log(`   创建时间: ${company.createTime}`);
            if (company.description) {
                console.log(`   描述: ${company.description.substring(0, 100)}${company.description.length > 100 ? '...' : ''}`);
            }
            console.log('');
        });
        console.log(`总计 ${companies.length} 个公司已导入到数据库`);
    }
    catch (error) {
        console.error('获取公司信息失败:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        const companies = loadCustomerCompanies();
        console.log(`加载了 ${companies.length} 个客户公司数据`);
        await importCompaniesToDB(companies);
        await displayImportedCompanies();
        console.log('\n=== 导入完成 ===');
        console.log('现在你可以在系统中看到所有的客户公司信息了！');
        console.log('这些公司用户可以作为独立的客户实体，也可以与具体的联系人用户进行关联。');
    }
    catch (error) {
        console.error('程序执行失败:', error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('数据库连接已关闭');
        process.exit(0);
    }
};
main();
//# sourceMappingURL=importCustomerCompaniesToDB.js.map