"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ServicePricing_1 = __importDefault(require("../models/ServicePricing"));
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
const convertCategoryIdToName = (categoryId) => {
    const categoryMap = {
        '1': '封面设计',
        '2': '版式设计',
        '3': '营销设计',
        '4': '排版服务',
        '5': '包装设计',
        '6': '杂志设计'
    };
    return categoryMap[categoryId] || '其他';
};
const parseProgressData = (progressJson) => {
    try {
        return JSON.parse(progressJson);
    }
    catch (error) {
        console.error('解析进度数据失败:', error);
        return [];
    }
};
const importServicePricingData = async (rawData) => {
    try {
        console.log(`开始导入 ${rawData.length} 条服务定价数据...`);
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        for (const service of rawData) {
            try {
                const existingService = await ServicePricing_1.default.findOne({
                    serviceName: service.name,
                    alias: service.alias
                });
                if (existingService) {
                    console.log(`跳过已存在服务: ${service.name} (${service.alias})`);
                    skipCount++;
                    continue;
                }
                const servicePricingData = {
                    serviceName: service.name,
                    alias: service.alias,
                    categoryId: service.category_id,
                    categoryName: convertCategoryIdToName(service.category_id),
                    unitPrice: parseFloat(service.price) || 0,
                    unit: service.unit,
                    priceDescription: service.description || '',
                    link: service.link || '',
                    status: 'active'
                };
                const newServicePricing = new ServicePricing_1.default(servicePricingData);
                await newServicePricing.save();
                successCount++;
                console.log(`✓ 成功导入: ${service.name} - ${service.price}${service.unit}`);
            }
            catch (error) {
                console.error(`✗ 导入失败 ${service.name}:`, error);
                errorCount++;
            }
        }
        console.log(`\n=== 导入完成 ===`);
        console.log(`成功: ${successCount} 条`);
        console.log(`跳过: ${skipCount} 条`);
        console.log(`失败: ${errorCount} 条`);
        console.log(`总计: ${rawData.length} 条`);
    }
    catch (error) {
        console.error('导入过程中发生错误:', error);
    }
};
const showImportStats = async () => {
    try {
        const totalServices = await ServicePricing_1.default.countDocuments();
        const activeServices = await ServicePricing_1.default.countDocuments({ status: 'active' });
        console.log(`\n=== 数据库统计 ===`);
        console.log(`总服务数量: ${totalServices} 个`);
        console.log(`活跃服务: ${activeServices} 个`);
        const services = await ServicePricing_1.default.find({});
        const categoryStats = {};
        services.forEach(service => {
            const categoryName = service.categoryName || '未分类';
            categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
        });
        console.log('\n=== 按类别统计 ===');
        Object.entries(categoryStats).forEach(([category, count]) => {
            console.log(`${category}: ${count} 个`);
        });
        console.log('\n=== 服务数据示例（前10个）===');
        services.slice(0, 10).forEach((service, index) => {
            console.log(`${index + 1}. ${service.serviceName} (${service.alias})`);
            console.log(`   类别: ${service.categoryName}`);
            console.log(`   价格: ${service.unitPrice}${service.unit}`);
            console.log(`   描述: ${service.priceDescription.substring(0, 50)}...`);
            console.log('');
        });
    }
    catch (error) {
        console.error('统计过程中发生错误:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        const filePath = path_1.default.join(__dirname, '../../../date/wp_dhs_quote_services.json');
        if (!fs_1.default.existsSync(filePath)) {
            console.error('找不到服务定价数据文件');
            process.exit(1);
        }
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        const rawData = jsonData[2].data;
        console.log(`原始服务定价数据条数: ${rawData.length}`);
        await importServicePricingData(rawData);
        await showImportStats();
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
//# sourceMappingURL=importServicePricing.js.map