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
const cleanCustomerData = (rawData) => {
    const cleanedData = [];
    for (const customer of rawData) {
        if (customer.blacklist === "1") {
            continue;
        }
        let customerName = customer.customer_name?.trim();
        if (!customerName || customerName === "NULL") {
            console.log(`跳过无名称客户: ${customer.id}`);
            continue;
        }
        let address = customer.customer_address;
        if (address === "NULL" || !address) {
            address = "无地址";
        }
        let invoiceInfo = customer.invoice_info;
        if (invoiceInfo === "NULL" || !invoiceInfo) {
            invoiceInfo = "";
        }
        let summary = customer.customer_summary;
        if (summary === "NULL" || !summary) {
            summary = "";
        }
        const customerData = {
            id: customer.id,
            customer_name: customerName,
            customer_address: address,
            invoice_info: invoiceInfo,
            invoice_type: customer.invoice_type,
            category_id: customer.category_id,
            pricelist_id: customer.pricelist_id,
            customer_rating: customer.customer_rating,
            customer_summary: summary,
            blacklist: customer.blacklist,
            created_at: customer.created_at
        };
        cleanedData.push(customerData);
    }
    return cleanedData;
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
const importCustomerDataToClientTable = async (cleanedData) => {
    try {
        console.log(`开始导入 ${cleanedData.length} 条客户数据到Client表...`);
        let successCount = 0;
        let skipCount = 0;
        for (const customer of cleanedData) {
            try {
                const existingClient = await Client_1.default.findOne({ name: customer.customer_name });
                if (existingClient) {
                    console.log(`跳过已存在客户: ${customer.customer_name}`);
                    skipCount++;
                    continue;
                }
                const clientData = {
                    name: customer.customer_name,
                    address: customer.customer_address || "无地址",
                    invoiceType: convertInvoiceType(customer.invoice_type),
                    invoiceInfo: customer.invoice_info || "",
                    category: convertCategory(customer.category_id),
                    rating: parseInt(customer.customer_rating) || 3,
                    summary: customer.customer_summary || "",
                    status: 'active',
                    createTime: customer.created_at.split(' ')[0],
                    updateTime: customer.created_at.split(' ')[0]
                };
                const newClient = new Client_1.default(clientData);
                await newClient.save();
                successCount++;
                console.log(`✓ 成功导入: ${customer.customer_name}`);
            }
            catch (error) {
                console.error(`✗ 导入失败 ${customer.customer_name}:`, error);
            }
        }
        console.log(`\n=== 导入完成 ===`);
        console.log(`成功: ${successCount} 条`);
        console.log(`跳过: ${skipCount} 条`);
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
        await importCustomerDataToClientTable(cleanedData);
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
//# sourceMappingURL=importCompaniesToClientTable.js.map