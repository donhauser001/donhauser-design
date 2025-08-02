import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

async function testOrderAPI() {
    console.log('🧪 开始测试订单API...')

    try {
        // 1. 测试获取订单列表
        console.log('\n1. 测试获取订单列表')
        const listResponse = await axios.get(`${API_BASE_URL}/orders`)
        console.log('✅ 获取订单列表成功:', listResponse.data)

        // 2. 测试创建订单
        console.log('\n2. 测试创建订单')
        const createData = {
            clientId: 'test-client-001',
            clientName: '测试客户公司',
            contactId: 'test-contact-001',
            contactName: '张三',
            contactPhone: '13800138000',
            projectName: '测试项目',
            selectedServices: ['service-001', 'service-002'],
            serviceDetails: [
                {
                    _id: 'service-001',
                    serviceName: '网站设计',
                    categoryName: '设计服务',
                    unitPrice: 5000,
                    unit: '个',
                    quantity: 1
                },
                {
                    _id: 'service-002',
                    serviceName: '前端开发',
                    categoryName: '开发服务',
                    unitPrice: 8000,
                    unit: '个',
                    quantity: 1
                }
            ],
            policies: []
        }

        const createResponse = await axios.post(`${API_BASE_URL}/orders`, createData)
        console.log('✅ 创建订单成功:', createResponse.data)

        const orderId = createResponse.data.data._id

        // 3. 测试获取订单详情
        console.log('\n3. 测试获取订单详情')
        const detailResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`)
        console.log('✅ 获取订单详情成功:', detailResponse.data)

        // 4. 测试获取版本历史
        console.log('\n4. 测试获取版本历史')
        const historyResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}/versions`)
        console.log('✅ 获取版本历史成功:', historyResponse.data)

        // 5. 测试获取快照
        console.log('\n5. 测试获取快照')
        const snapshotResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}/versions/1`)
        console.log('✅ 获取快照成功:', snapshotResponse.data)

        // 6. 测试更新订单
        console.log('\n6. 测试更新订单')
        const updateData = {
            ...createData,
            projectName: '更新后的测试项目',
            serviceDetails: [
                {
                    _id: 'service-001',
                    serviceName: '网站设计',
                    categoryName: '设计服务',
                    unitPrice: 5000,
                    unit: '个',
                    quantity: 2  // 修改数量
                }
            ]
        }

        const updateResponse = await axios.put(`${API_BASE_URL}/orders/${orderId}`, updateData)
        console.log('✅ 更新订单成功:', updateResponse.data)

        console.log('\n🎉 所有API测试通过！')

    } catch (error: any) {
        console.error('❌ API测试失败:', error.response?.data || error.message)
    }
}

// 运行测试
testOrderAPI() 