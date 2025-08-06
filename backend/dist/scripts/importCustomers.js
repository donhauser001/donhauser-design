"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
            address = undefined;
        }
        let invoiceInfo = customer.invoice_info;
        if (invoiceInfo === "NULL" || !invoiceInfo) {
            invoiceInfo = undefined;
        }
        let summary = customer.customer_summary;
        if (summary === "NULL" || !summary) {
            summary = undefined;
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
const importCustomerData = async (cleanedData) => {
    try {
        console.log(`开始导入 ${cleanedData.length} 条客户数据...`);
        console.log('\n客户数据示例:');
        cleanedData.slice(0, 5).forEach((item, index) => {
            console.log(`${index + 1}. ${item.customer_name} - ${item.customer_address || '无地址'}`);
        });
        const outputPath = path_1.default.join(__dirname, '../../../customer_data_cleaned.json');
        fs_1.default.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2), 'utf-8');
        console.log(`\n客户数据已保存到: ${outputPath}`);
    }
    catch (error) {
        console.error('导入过程中发生错误:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        const filePath = path_1.default.join(__dirname, '../../../date/wp_dhs_customers.json');
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        const rawData = jsonData[2].data;
        console.log(`原始客户数据条数: ${rawData.length}`);
        const cleanedData = cleanCustomerData(rawData);
        console.log(`清理后客户数据条数: ${cleanedData.length}`);
        await importCustomerData(cleanedData);
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
//# sourceMappingURL=importCustomers.js.map