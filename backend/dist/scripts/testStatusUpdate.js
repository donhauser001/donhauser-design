"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = 'http://localhost:3000/api';
async function testStatusUpdate() {
    console.log('🧪 开始测试订单状态更新...');
    try {
        console.log('\n1. 获取订单列表');
        const listResponse = await axios_1.default.get(`${API_BASE_URL}/orders`);
        const orders = listResponse.data.data;
        if (orders.length === 0) {
            console.log('❌ 没有找到订单，无法测试状态更新');
            return;
        }
        const testOrder = orders[0];
        console.log('✅ 找到测试订单:', testOrder.orderNo, '当前状态:', testOrder.status);
        console.log('\n2. 测试取消订单');
        const cancelResponse = await axios_1.default.patch(`${API_BASE_URL}/orders/${testOrder._id}/status`, {
            status: 'cancelled'
        });
        console.log('✅ 取消订单成功:', cancelResponse.data);
        console.log('\n3. 验证状态更新');
        const verifyResponse = await axios_1.default.get(`${API_BASE_URL}/orders/${testOrder._id}`);
        console.log('✅ 验证成功，新状态:', verifyResponse.data.data.status);
        console.log('\n4. 测试恢复订单');
        const restoreResponse = await axios_1.default.patch(`${API_BASE_URL}/orders/${testOrder._id}/status`, {
            status: 'normal'
        });
        console.log('✅ 恢复订单成功:', restoreResponse.data);
        console.log('\n5. 最终验证');
        const finalResponse = await axios_1.default.get(`${API_BASE_URL}/orders/${testOrder._id}`);
        console.log('✅ 最终验证成功，状态:', finalResponse.data.data.status);
        console.log('\n🎉 状态更新测试全部通过！');
    }
    catch (error) {
        console.error('❌ 状态更新测试失败:', error.response?.data || error.message);
    }
}
testStatusUpdate();
//# sourceMappingURL=testStatusUpdate.js.map