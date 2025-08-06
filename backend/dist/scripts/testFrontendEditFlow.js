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
            console.log(`${index + 1}. ${quotation.name} - 默认: ${quotation.isDefault ? '是' : '否'} - 状态: ${quotation.status}`);
        });
    }
    catch (error) {
        console.error('❌ 获取报价单失败:', error);
    }
};
const testFrontendEditFlow = async () => {
    try {
        const quotations = await QuotationService_1.default.getAllQuotations();
        const nonDefaultQuotation = quotations.find(q => !q.isDefault && q.status === 'active');
        if (!nonDefaultQuotation) {
            console.log('⚠️ 没有找到非默认的活跃报价单');
            return;
        }
        console.log(`\n🔄 模拟前端编辑流程: "${nonDefaultQuotation.name}"`);
        console.log('1. 获取报价单详情...');
        const quotationDetail = await QuotationService_1.default.getQuotationById(nonDefaultQuotation._id?.toString() || '');
        if (quotationDetail) {
            console.log(`   当前默认状态: ${quotationDetail.isDefault ? '是' : '否'}`);
        }
        console.log('2. 模拟用户勾选"设为默认报价"...');
        const formData = {
            name: quotationDetail?.name || '',
            description: quotationDetail?.description || '',
            isDefault: true,
            selectedServices: quotationDetail?.selectedServices || [],
            validUntil: quotationDetail?.validUntil
        };
        console.log('   表单数据:', formData);
        console.log('3. 调用更新API...');
        const updatedQuotation = await QuotationService_1.default.updateQuotation(nonDefaultQuotation._id?.toString() || '', formData);
        if (updatedQuotation) {
            console.log(`✅ 更新成功: ${updatedQuotation.name}`);
            console.log(`   更新后默认状态: ${updatedQuotation.isDefault ? '是' : '否'}`);
        }
        else {
            console.log('❌ 更新失败');
        }
        console.log('4. 重新加载数据...');
        const allQuotations = await QuotationService_1.default.getAllQuotations();
        const defaultQuotation = allQuotations.find(q => q.isDefault);
        if (defaultQuotation) {
            console.log(`   当前默认报价单: ${defaultQuotation.name}`);
        }
        await showDefaultStatus();
    }
    catch (error) {
        console.error('❌ 测试失败:', error);
    }
};
const main = async () => {
    console.log('🚀 开始测试前端编辑流程...');
    await connectDB();
    await showDefaultStatus();
    await testFrontendEditFlow();
    console.log('\n✅ 测试完成');
    process.exit(0);
};
main().catch((error) => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
});
//# sourceMappingURL=testFrontendEditFlow.js.map