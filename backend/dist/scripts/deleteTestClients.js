"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
const deleteTestClients = async () => {
    try {
        console.log('开始删除测试客户数据...');
        const testClientNames = [
            'YZ建筑公司',
            'DEF制造公司',
            'MNO餐饮连锁',
            'XYZ设计工作室',
            'JKL教育集团',
            'VWX医疗设备',
            'ABC科技有限公司',
            'STU房地产',
            'GHI贸易有限公司'
        ];
        const testClients = await Client_1.default.find({
            name: { $in: testClientNames }
        });
        console.log(`找到 ${testClients.length} 个测试客户需要删除`);
        if (testClients.length === 0) {
            console.log('没有找到需要删除的测试客户');
            return;
        }
        console.log('\n将要删除的测试客户:');
        testClients.forEach((client, index) => {
            console.log(`${index + 1}. ${client.name} - ${client.category} - ${client.address}`);
        });
        const deleteResult = await Client_1.default.deleteMany({
            name: { $in: testClientNames }
        });
        console.log(`\n=== 删除完成 ===`);
        console.log(`成功删除: ${deleteResult.deletedCount} 个测试客户`);
        const remainingClients = await Client_1.default.countDocuments();
        console.log(`剩余客户数量: ${remainingClients} 个`);
        const remainingClientsData = await Client_1.default.find({});
        const categoryStats = {};
        remainingClientsData.forEach(client => {
            categoryStats[client.category] = (categoryStats[client.category] || 0) + 1;
        });
        console.log('\n=== 剩余客户分类统计 ===');
        Object.entries(categoryStats).forEach(([category, count]) => {
            console.log(`${category}: ${count} 个`);
        });
    }
    catch (error) {
        console.error('删除过程中发生错误:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        await deleteTestClients();
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
//# sourceMappingURL=deleteTestClients.js.map