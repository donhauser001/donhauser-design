import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import ServicePricing from '../models/ServicePricing';

// 连接数据库
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/donhauser');
        console.log('数据库连接成功');
    } catch (error) {
        console.error('数据库连接失败:', error);
        process.exit(1);
    }
};

// 定义服务定价数据接口
interface ServicePricingData {
    id: string;
    name: string;
    alias: string;
    category_id: string;
    price: string;
    unit: string;
    description: string;
    link: string;
    policy: string | null;
    performance_ratio: string;
    auxiliary_performance_ratio: string;
    progress: string;
    initial_proposal_count: string;
    max_proposal_count: string;
    disable_subtasks: string;
}

// 转换类别ID到类别名称
const convertCategoryIdToName = (categoryId: string): string => {
    const categoryMap: { [key: string]: string } = {
        '1': '封面设计',
        '2': '版式设计',
        '3': '营销设计',
        '4': '排版服务',
        '5': '包装设计',
        '6': '杂志设计'
    };
    return categoryMap[categoryId] || '其他';
};

// 解析进度数据
const parseProgressData = (progressJson: string): any[] => {
    try {
        return JSON.parse(progressJson);
    } catch (error) {
        console.error('解析进度数据失败:', error);
        return [];
    }
};

// 导入服务定价数据
const importServicePricingData = async (rawData: ServicePricingData[]) => {
    try {
        console.log(`开始导入 ${rawData.length} 条服务定价数据...`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const service of rawData) {
            try {
                // 检查是否已存在同名服务
                const existingService = await ServicePricing.findOne({
                    serviceName: service.name,
                    alias: service.alias
                });

                if (existingService) {
                    console.log(`跳过已存在服务: ${service.name} (${service.alias})`);
                    skipCount++;
                    continue;
                }

                // 创建新的服务定价记录
                const servicePricingData = {
                    serviceName: service.name,
                    alias: service.alias,
                    categoryId: service.category_id,
                    categoryName: convertCategoryIdToName(service.category_id),
                    unitPrice: parseFloat(service.price) || 0,
                    unit: service.unit,
                    priceDescription: service.description || '',
                    link: service.link || '',
                    status: 'active' as const
                };

                const newServicePricing = new ServicePricing(servicePricingData);
                await newServicePricing.save();
                successCount++;

                console.log(`✓ 成功导入: ${service.name} - ${service.price}${service.unit}`);

            } catch (error) {
                console.error(`✗ 导入失败 ${service.name}:`, error);
                errorCount++;
            }
        }

        console.log(`\n=== 导入完成 ===`);
        console.log(`成功: ${successCount} 条`);
        console.log(`跳过: ${skipCount} 条`);
        console.log(`失败: ${errorCount} 条`);
        console.log(`总计: ${rawData.length} 条`);

    } catch (error) {
        console.error('导入过程中发生错误:', error);
    }
};

// 显示导入统计
const showImportStats = async () => {
    try {
        const totalServices = await ServicePricing.countDocuments();
        const activeServices = await ServicePricing.countDocuments({ status: 'active' });

        console.log(`\n=== 数据库统计 ===`);
        console.log(`总服务数量: ${totalServices} 个`);
        console.log(`活跃服务: ${activeServices} 个`);

        // 按类别统计
        const services = await ServicePricing.find({});
        const categoryStats: { [key: string]: number } = {};

        services.forEach(service => {
            const categoryName = service.categoryName || '未分类';
            categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
        });

        console.log('\n=== 按类别统计 ===');
        Object.entries(categoryStats).forEach(([category, count]) => {
            console.log(`${category}: ${count} 个`);
        });

        // 显示前10个服务示例
        console.log('\n=== 服务数据示例（前10个）===');
        services.slice(0, 10).forEach((service, index) => {
            console.log(`${index + 1}. ${service.serviceName} (${service.alias})`);
            console.log(`   类别: ${service.categoryName}`);
            console.log(`   价格: ${service.unitPrice}${service.unit}`);
            console.log(`   描述: ${service.priceDescription.substring(0, 50)}...`);
            console.log('');
        });

    } catch (error) {
        console.error('统计过程中发生错误:', error);
    }
};

// 主函数
const main = async () => {
    try {
        // 连接数据库
        await connectDB();

        // 读取JSON文件
        const filePath = path.join(__dirname, '../../../date/wp_dhs_quote_services.json');
        if (!fs.existsSync(filePath)) {
            console.error('找不到服务定价数据文件');
            process.exit(1);
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // 提取数据数组
        const rawData = jsonData[2].data; // 根据JSON结构，数据在第3个元素
        console.log(`原始服务定价数据条数: ${rawData.length}`);

        // 导入数据
        await importServicePricingData(rawData);

        // 显示统计信息
        await showImportStats();

    } catch (error) {
        console.error('程序执行失败:', error);
    } finally {
        // 关闭数据库连接
        await mongoose.connection.close();
        console.log('数据库连接已关闭');
        process.exit(0);
    }
};

// 运行脚本
main(); 