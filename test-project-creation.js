// 测试项目创建功能
async function testProjectCreation() {
    console.log('🧪 开始测试项目创建功能...\n');

    try {
        // 测试数据
        const testProjectData = {
            project: {
                projectName: '测试项目 - 网站设计',
                clientId: 'test-client-id',
                clientName: '测试客户',
                contactIds: ['contact-1', 'contact-2'],
                contactNames: '张三, 李四',
                contactPhones: '13800138000, 13900139000',
                undertakingTeam: 'test-enterprise-id',
                undertakingTeamName: '测试企业',
                mainDesigners: ['designer-1', 'designer-2'],
                mainDesignerNames: '设计师A, 设计师B',
                assistantDesigners: ['designer-3'],
                assistantDesignerNames: '设计师C',
                clientRequirements: '需要一个现代化的企业网站',
                remark: '这是一个测试项目',
                progressStatus: 'in-progress', // 直接下单 - 进行中
                settlementStatus: 'unpaid',
                totalAmount: 15000,
                originalAmount: 18000,
                discountAmount: 3000
            },
            services: [
                {
                    serviceId: 'service-1',
                    serviceName: '网站设计',
                    quantity: 1,
                    unitPrice: 8000,
                    unit: '套',
                    subtotal: 8000,
                    pricingPolicies: ['policy-1'],
                    pricingPolicyNames: '新客户优惠',
                    discountAmount: 800,
                    finalAmount: 7200
                },
                {
                    serviceId: 'service-2',
                    serviceName: '网站开发',
                    quantity: 1,
                    unitPrice: 10000,
                    unit: '套',
                    subtotal: 10000,
                    pricingPolicies: ['policy-2'],
                    pricingPolicyNames: '批量优惠',
                    discountAmount: 2200,
                    finalAmount: 7800
                }
            ]
        };

        console.log('📋 测试数据:');
        console.log('- 项目名称:', testProjectData.project.projectName);
        console.log('- 客户:', testProjectData.project.clientName);
        console.log('- 承接团队:', testProjectData.project.undertakingTeamName);
        console.log('- 主创设计师:', testProjectData.project.mainDesignerNames);
        console.log('- 服务项目数量:', testProjectData.services.length);
        console.log('- 项目状态:', testProjectData.project.progressStatus);
        console.log('- 总金额:', testProjectData.project.totalAmount);
        console.log('- 优惠金额:', testProjectData.project.discountAmount);
        console.log('');

        // 发送创建项目请求
        console.log('🚀 发送创建项目请求...');
        const response = await fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testProjectData),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ 项目创建成功!');
            console.log('- 项目ID:', result.data.project._id);
            console.log('- 创建的任务数量:', result.data.tasks.length);
            console.log('- 返回消息:', result.message);

            if (result.data.tasks.length > 0) {
                console.log('\n📝 创建的任务详情:');
                result.data.tasks.forEach((task, index) => {
                    console.log(`  任务 ${index + 1}:`);
                    console.log(`    - 任务名称: ${task.taskName}`);
                    console.log(`    - 服务ID: ${task.serviceId}`);
                    console.log(`    - 数量: ${task.quantity}${task.unit}`);
                    console.log(`    - 小计: ${task.subtotal}`);
                    console.log(`    - 状态: ${task.status}`);
                    console.log(`    - 结算状态: ${task.settlementStatus}`);
                    console.log(`    - 分配设计师: ${task.assignedDesigners?.length || 0}人`);
                });
            }
        } else {
            console.log('❌ 项目创建失败!');
            console.log('- 错误信息:', result.message);
            console.log('- 详细错误:', result.error);
        }

    } catch (error) {
        console.log('❌ 测试过程中发生错误:');
        console.log('- 错误信息:', error.message);
    }
}

// 运行测试
testProjectCreation(); 