import React, { useState } from 'react';
import { Form, Button, Card, Space, Tabs, Tag, Input } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from './hooks';
import { createProject, validateProjectData } from './services';
import { ProjectFormData } from './types';
import BasicInfoTab from './components/BasicInfoTab';
import QuotationsTab from './components/QuotationsTab';
import OrderTab from './components/OrderTab';

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const {
        clients,
        contacts,
        enterprises,
        designers,
        services,
        selectedClient,
        tasks,
        quotations,
        filteredContacts,
        handleClientChange,
        handleContactChange,
        addTask,
        removeTask,
        updateTask,
        calculateSubtotal
    } = useCreateProject();

    const handleSubmit = async (values: ProjectFormData) => {
        try {
            setLoading(true);

            // 验证数据
            if (!validateProjectData(values, tasks)) {
                return;
            }

            // 处理客户和联系人信息
            const client = clients.find(c => c._id === values.clientId);
            const selectedContacts = contacts.filter(c => values.contactIds?.includes(c._id));

            const projectData = {
                ...values,
                clientName: client?.name,
                contactNames: selectedContacts.map(c => c.realName).join(', '),
                contactPhones: selectedContacts.map(c => c.phone).join(', ')
            };

            // 创建项目
            await createProject(projectData, tasks);

            // 跳转到项目列表
            navigate('/projects');
        } catch (error) {
            console.error('提交失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>创建新项目</span>
                        <Tag color="blue">项目信息</Tag>
                    </div>
                }
                extra={
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            返回列表
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={loading}
                            onClick={() => form.submit()}
                            size="large"
                        >
                            保存项目
                        </Button>
                    </Space>
                }
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    marginBottom: '24px'
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        progressStatus: 'consulting',
                        settlementStatus: 'unpaid',
                        mainDesigners: [],
                        assistantDesigners: []
                    }}
                >
                    <Tabs
                        defaultActiveKey="basic"
                        type="card"
                        size="large"
                        style={{ marginBottom: 24 }}
                        items={[
                            {
                                key: 'basic',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#1890ff' }}>📋</span>
                                        <span>基本信息</span>
                                    </div>
                                ),
                                children: (
                                    <BasicInfoTab
                                        clients={clients}
                                        contacts={contacts}
                                        enterprises={enterprises}
                                        designers={designers}
                                        selectedClient={selectedClient}
                                        filteredContacts={filteredContacts}
                                        handleClientChange={handleClientChange}
                                        handleContactChange={handleContactChange}
                                    />
                                )
                            },
                            {
                                key: 'quotations',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#1890ff' }}>📋</span>
                                        <span>报价单</span>
                                        <Tag color="blue">{quotations.length}</Tag>
                                    </div>
                                ),
                                children: (
                                    <QuotationsTab
                                        quotations={quotations}
                                        selectedClient={selectedClient}
                                    />
                                )
                            },
                            {
                                key: 'order',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#13c2c2' }}>💰</span>
                                        <span>订单信息</span>
                                    </div>
                                ),
                                children: <OrderTab />
                            }
                        ]}
                    />

                    {/* 隐藏字段用于存储客户和联系人信息 */}
                    <Form.Item name="clientName" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactNames" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactPhones" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateProject; 