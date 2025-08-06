"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServicePricing_1 = __importDefault(require("../models/ServicePricing"));
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
const getServicesByCategory = (servicePricings, showDisabled) => {
    const grouped = {};
    console.log('显示禁用项目:', showDisabled);
    const allCategories = new Set();
    servicePricings.forEach(service => {
        const categoryName = service.categoryName || service.categoryId;
        allCategories.add(categoryName);
    });
    console.log('所有分类:', Array.from(allCategories));
    allCategories.forEach(categoryName => {
        grouped[categoryName] = [];
    });
    servicePricings.forEach(service => {
        if (showDisabled || service.status === 'active') {
            const categoryName = service.categoryName || service.categoryId;
            grouped[categoryName].push(service);
        }
    });
    console.log('按分类分组结果:', Object.keys(grouped));
    return grouped;
};
const testCategoryOrder = async () => {
    try {
        const servicePricings = await ServicePricing_1.default.find();
        console.log(`\n📊 总共有 ${servicePricings.length} 个服务项目`);
        console.log('\n🔄 测试隐藏禁用项目时的分类顺序:');
        const result1 = getServicesByCategory(servicePricings, false);
        console.log('\n🔄 测试显示所有项目时的分类顺序:');
        const result2 = getServicesByCategory(servicePricings, true);
        const keys1 = Object.keys(result1);
        const keys2 = Object.keys(result2);
        console.log('\n📋 分类顺序比较:');
        console.log('隐藏禁用项目时:', keys1);
        console.log('显示所有项目时:', keys2);
        console.log('顺序是否一致:', JSON.stringify(keys1) === JSON.stringify(keys2));
        console.log('\n📊 各分类服务数量:');
        keys1.forEach(category => {
            const count1 = result1[category].length;
            const count2 = result2[category].length;
            console.log(`${category}: ${count1} -> ${count2} 项`);
        });
    }
    catch (error) {
        console.error('❌ 测试失败:', error);
    }
};
const main = async () => {
    console.log('🚀 开始测试分类顺序固定性...');
    await connectDB();
    await testCategoryOrder();
    console.log('\n✅ 测试完成');
    process.exit(0);
};
main().catch((error) => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
});
//# sourceMappingURL=testCategoryOrder.js.map