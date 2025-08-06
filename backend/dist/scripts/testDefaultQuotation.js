"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuotationService_1 = __importDefault(require("../services/QuotationService"));
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
const showDefaultStatus = async () => {
    try {
        const quotations = await QuotationService_1.default.getAllQuotations();
        console.log('\n📊 当前所有报价单的默认状态:');
        quotations.forEach((quotation, index) => {
            console.log(`${index + 1}. ${quotation.name} - 默认: ${quotation.isDefault ? '是' : '否'}`);
        });
    }
    catch (error) {
        console.error('❌ 获取报价单失败:', error);
    }
};
const testSetNewDefault = async () => {
    try {
        const quotations = await QuotationService_1.default.getAllQuotations();
        if (quotations.length < 2) {
            console.log('⚠️ 报价单数量不足，无法测试');
            return;
        }
        const nonDefaultQuotation = quotations.find(q => !q.isDefault);
        if (!nonDefaultQuotation) {
            console.log('⚠️ 没有找到非默认的报价单');
            return;
        }
        console.log(`\n🔄 测试设置 "${nonDefaultQuotation.name}" 为默认报价单...`);
        const updatedQuotation = await QuotationService_1.default.updateQuotation(nonDefaultQuotation._id?.toString() || '', {
            name: nonDefaultQuotation.name,
            description: nonDefaultQuotation.description,
            isDefault: true,
            selectedServices: nonDefaultQuotation.selectedServices,
            validUntil: nonDefaultQuotation.validUntil
        });
        if (updatedQuotation) {
            console.log(`✅ 成功设置 "${updatedQuotation.name}" 为默认报价单`);
        }
        else {
            console.log('❌ 设置默认报价单失败');
        }
        await showDefaultStatus();
    }
    catch (error) {
        console.error('❌ 测试失败:', error);
    }
};
const main = async () => {
    console.log('🚀 开始测试默认报价单逻辑...');
    await connectDB();
    await showDefaultStatus();
    await testSetNewDefault();
    console.log('\n✅ 测试完成');
    process.exit(0);
};
main().catch((error) => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
});
//# sourceMappingURL=testDefaultQuotation.js.map