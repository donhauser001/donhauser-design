"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPricingCategories = seedPricingCategories;
const mongoose_1 = __importDefault(require("mongoose"));
const PricingCategory_1 = require("../models/PricingCategory");
const PricingCategoryService_1 = require("../services/PricingCategoryService");
const defaultCategories = [
    {
        name: '设计服务',
        description: '平面设计、UI设计、品牌设计等服务',
        status: 'active'
    },
    {
        name: '开发服务',
        description: '网站开发、小程序开发、APP开发等服务',
        status: 'active'
    },
    {
        name: '营销服务',
        description: 'SEO优化、SEM推广、社交媒体营销等服务',
        status: 'active'
    },
    {
        name: '咨询服务',
        description: '技术咨询、项目规划、方案设计等服务',
        status: 'active'
    },
    {
        name: '运维服务',
        description: '服务器维护、系统监控、数据备份等服务',
        status: 'active'
    }
];
async function seedPricingCategories() {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/donhauser');
        console.log('数据库连接成功');
        await PricingCategory_1.PricingCategory.deleteMany({});
        console.log('已清空现有定价分类数据');
        const createdCategories = [];
        for (const categoryData of defaultCategories) {
            try {
                const category = await PricingCategoryService_1.PricingCategoryService.createCategory(categoryData);
                createdCategories.push(category);
                console.log(`创建分类: ${category.name}`);
            }
            catch (error) {
                console.error(`创建分类失败 ${categoryData.name}:`, error);
            }
        }
        console.log(`成功创建 ${createdCategories.length} 个定价分类`);
        console.log('\n创建的分类列表:');
        createdCategories.forEach(category => {
            console.log(`- ${category.name}: ${category.description}`);
        });
    }
    catch (error) {
        console.error('初始化定价分类失败:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('数据库连接已关闭');
    }
}
if (require.main === module) {
    seedPricingCategories();
}
//# sourceMappingURL=seedPricingCategories.js.map