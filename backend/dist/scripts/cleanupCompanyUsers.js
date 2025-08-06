"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
const cleanupCompanyUsers = async () => {
    try {
        console.log('开始清理错误导入的公司用户数据...');
        const companyUsers = await User_1.default.find({
            email: { $regex: /@donhauser\.com$/ }
        });
        console.log(`找到 ${companyUsers.length} 个公司用户需要删除`);
        if (companyUsers.length === 0) {
            console.log('没有找到需要清理的公司用户数据');
            return;
        }
        console.log('\n将要删除的公司用户:');
        companyUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.realName} - ${user.email}`);
        });
        const deleteResult = await User_1.default.deleteMany({
            email: { $regex: /@donhauser\.com$/ }
        });
        console.log(`\n=== 清理完成 ===`);
        console.log(`成功删除: ${deleteResult.deletedCount} 个公司用户`);
        const remainingUsers = await User_1.default.countDocuments();
        console.log(`剩余用户数量: ${remainingUsers} 个`);
    }
    catch (error) {
        console.error('清理过程中发生错误:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        await cleanupCompanyUsers();
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
//# sourceMappingURL=cleanupCompanyUsers.js.map