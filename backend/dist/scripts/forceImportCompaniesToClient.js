"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Client_1 = __importDefault(require("../models/Client"));
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
const convertInvoiceType = (invoiceType) => {
    switch (invoiceType) {
        case '电子专票':
        case '增值税专用发票':
            return '增值税专用发票';
        case '电子普票':
        case '增值税普通发票':
            return '增值税普通发票';
        default:
            return '增值税普通发票';
    }
};
const convertCategory = (categoryId) => {
    const categoryMap = {
        '1': '出版社',
        '2': '教育机构',
        '3': '文化传媒',
        '4': '科技公司',
        '5': '政府机构',
        '6': '其他'
    };
    return categoryMap[categoryId] || '其他';
};
const forceImportCustomerDataToClientTable = async (cleanedData) => {
    try {
        console.log(`开始强制重新导入 ${cleanedData.length} 条客户数据到Client表...`);
        const deleteResult = await Client_1.default.deleteMany({
            category: { $in: ['出版社', '文化传媒', '教育机构', '科技公司', '政府机构', '其他'] }
        });
        console.log(`删除了 ${deleteResult.deletedCount} 个现有公司客户`);
        let successCount = 0;
        let errorCount = 0;
        for (const customer of cleanedData) {
            try {
                if (customer.blacklist === "1") {
                    continue;
                }
                let customerName = customer.customer_name?.trim();
                if (!customerName || customerName === "NULL") {
                    continue;
                }
                const clientData = {
                    name: customerName,
                    address: customer.customer_address === "NULL" || !customer.customer_address ? "无地址" : customer.customer_address,
                    invoiceType: convertInvoiceType(customer.invoice_type),
                    invoiceInfo: customer.invoice_info === "NULL" || !customer.invoice_info ? "" : customer.invoice_info,
                    category: convertCategory(customer.category_id),
                    rating: parseInt(customer.customer_rating) || 3,
                    summary: customer.customer_summary === "NULL" || !customer.customer_summary ? "" : customer.customer_summary,
                    status: 'active',
                    createTime: customer.created_at.split(' ')[0],
                    updateTime: customer.created_at.split(' ')[0]
                };
                const newClient = new Client_1.default(clientData);
                await newClient.save();
                successCount++;
                console.log(`✓ 成功导入: ${customerName}`);
            }
            catch (error) {
                console.error(`✗ 导入失败 ${customer.customer_name}:`, error);
                errorCount++;
            }
        }
        console.log(`\n=== 强制重新导入完成 ===`);
        console.log(`成功: ${successCount} 条`);
        console.log(`失败: ${errorCount} 条`);
        console.log(`总计: ${cleanedData.length} 条`);
    }
    catch (error) {
        console.error('导入过程中发生错误:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        const filePath = path_1.default.join(__dirname, '../../../customer_data_cleaned.json');
        if (!fs_1.default.existsSync(filePath)) {
            console.error('找不到清理后的客户数据文件，请先运行 importCustomers.ts');
            process.exit(1);
        }
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const cleanedData = JSON.parse(fileContent);
        console.log(`加载了 ${cleanedData.length} 个客户数据`);
        await forceImportCustomerDataToClientTable(cleanedData);
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
//# sourceMappingURL=forceImportCompaniesToClient.js.map