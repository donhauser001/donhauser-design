// 测试表单API的脚本
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testFormAPI() {
    console.log('🧪 开始测试表单API...\n');

    try {
        // 1. 测试获取表单分类
        console.log('1. 测试获取表单分类...');
        const categoriesResponse = await axios.get(`${API_BASE}/form-categories`);
        console.log('✅ 表单分类获取成功, 数量:', categoriesResponse.data.data.categories?.length || 0);
        const categories = categoriesResponse.data.data.categories || [];
        
        if (categories.length === 0) {
            console.log('⚠️  没有表单分类，创建一个测试分类...');
            const newCategory = await axios.post(`${API_BASE}/form-categories`, {
                name: '测试分类',
                description: '用于测试的表单分类',
                color: '#1890ff',
                isActive: true
            });
            console.log('✅ 测试分类创建成功:', newCategory.data.data.name);
            categories.push(newCategory.data.data);
        }

        // 2. 测试创建表单
        console.log('\n2. 测试创建表单...');
        const testFormData = {
            name: '测试表单',
            description: '这是一个测试表单',
            categoryId: categories[0]._id,
            content: {
                metadata: {
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    designerVersion: '1.0.0'
                },
                config: {
                    components: [
                        {
                            id: 'component_test_001',
                            type: 'input',
                            label: '测试输入框',
                            placeholder: '请输入内容',
                            required: true,
                            order: 0
                        },
                        {
                            id: 'component_test_002',
                            type: 'select',
                            label: '测试下拉选择',
                            options: [
                                { label: '选项1', value: 'option1' },
                                { label: '选项2', value: 'option2' }
                            ],
                            required: false,
                            order: 1
                        }
                    ],
                    layout: {
                        columns: 1,
                        gutter: 16,
                        responsive: true,
                        logicRules: [
                            {
                                id: 'rule_001',
                                type: 'visibility',
                                sourceComponent: 'component_test_001',
                                condition: 'equals',
                                value: 'test',
                                targetComponent: 'component_test_002',
                                action: 'hidden'
                            }
                        ]
                    },
                    theme: {
                        primaryColor: '#1890ff',
                        backgroundColor: '#ffffff',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px',
                        fontSize: '14px'
                    }
                },
                runtime: {
                    componentValues: {},
                    selectedServices: {},
                    orderItems: {}
                }
            },
            status: 'draft'
        };

        const createResponse = await axios.post(`${API_BASE}/forms`, testFormData);
        console.log('✅ 表单创建成功, ID:', createResponse.data.data._id);
        const formId = createResponse.data.data._id;

        // 3. 测试获取表单
        console.log('\n3. 测试获取表单...');
        const getResponse = await axios.get(`${API_BASE}/forms/${formId}`);
        console.log('✅ 表单获取成功, 名称:', getResponse.data.data.name);
        
        // 验证content字段
        const savedContent = getResponse.data.data.content;
        console.log('📊 保存的表单内容结构:');
        console.log('  - metadata版本:', savedContent?.metadata?.version);
        console.log('  - 组件数量:', savedContent?.config?.components?.length || 0);
        console.log('  - 逻辑规则数量:', savedContent?.config?.layout?.logicRules?.length || 0);
        console.log('  - 主题颜色:', savedContent?.config?.theme?.primaryColor);

        // 4. 测试更新表单
        console.log('\n4. 测试更新表单...');
        const updatedContent = {
            ...savedContent,
            config: {
                ...savedContent.config,
                components: [
                    ...savedContent.config.components,
                    {
                        id: 'component_test_003',
                        type: 'textarea',
                        label: '新增文本域',
                        placeholder: '请输入详细内容',
                        required: false,
                        order: 2
                    }
                ]
            },
            metadata: {
                ...savedContent.metadata,
                updatedAt: new Date().toISOString()
            }
        };

        const updateResponse = await axios.put(`${API_BASE}/forms/${formId}`, {
            content: updatedContent,
            description: '已更新的测试表单'
        });
        console.log('✅ 表单更新成功');
        console.log('  - 新的组件数量:', updateResponse.data.data.content?.config?.components?.length || 0);

        // 5. 测试获取表单列表
        console.log('\n5. 测试获取表单列表...');
        const listResponse = await axios.get(`${API_BASE}/forms?limit=5`);
        console.log('✅ 表单列表获取成功, 总数:', listResponse.data.data.total);

        // 6. 测试删除表单
        console.log('\n6. 测试删除表单...');
        await axios.delete(`${API_BASE}/forms/${formId}`);
        console.log('✅ 表单删除成功');

        console.log('\n🎉 所有API测试通过！前后端连接正常。');

    } catch (error) {
        console.error('\n❌ API测试失败:');
        if (error.response) {
            console.error('  状态码:', error.response.status);
            console.error('  错误信息:', error.response.data);
        } else if (error.request) {
            console.error('  请求失败，无响应');
            console.error('  检查后端服务是否启动:', API_BASE);
        } else {
            console.error('  错误:', error.message);
        }
    }
}

testFormAPI();
