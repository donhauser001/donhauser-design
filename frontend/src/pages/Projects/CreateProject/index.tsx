import React, { useState } from 'react';
import { Form, Button, Card, Space, Steps, Tag, Input } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, FileTextOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);

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

    const handleNext = () => {
        // 验证当前步骤
        if (currentStep === 0) {
            // 验证基本信息：必须选择客户
            if (!selectedClient) {
                return;
            }
        } else if (currentStep === 1) {
            // 验证任务列表：必须选择至少一个服务
            // 这里可以从QuotationsTab组件获取选中的服务数量
            // 暂时跳过验证，允许用户直接进入下一步
        }

        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleStepClick = (step: number) => {
        setCurrentStep(step);
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
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/projects')}
                    >
                        返回列表
                    </Button>
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
                    <Steps
                        current={currentStep}
                        onChange={handleStepClick}
                        style={{ marginBottom: 24 }}
                        items={[
                            {
                                title: '基本信息',
                                description: '填写项目基本信息',
                                icon: (
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: currentStep >= 0 ? '#1890ff' : '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: currentStep >= 0 ? '2px solid #1890ff' : '2px solid #d9d9d9'
                                    }}>
                                        <FileTextOutlined style={{
                                            color: currentStep >= 0 ? '#fff' : '#666',
                                            fontSize: '16px'
                                        }} />
                                    </div>
                                ),
                                status: currentStep >= 0 ? 'process' : 'wait'
                            },
                            {
                                title: '任务列表',
                                description: `选择服务项目 ${quotations.length > 0 ? quotations[0].selectedServices.length : 0} 项`,
                                icon: (
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: currentStep >= 1 ? '#1890ff' : '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: currentStep >= 1 ? '2px solid #1890ff' : '2px solid #d9d9d9'
                                    }}>
                                        <FileTextOutlined style={{
                                            color: currentStep >= 1 ? '#fff' : '#666',
                                            fontSize: '16px'
                                        }} />
                                    </div>
                                ),
                                status: currentStep >= 1 ? 'process' : 'wait',
                                disabled: !selectedClient
                            },
                            {
                                title: '订单信息',
                                description: '确认订单详情',
                                icon: (
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: currentStep >= 2 ? '#1890ff' : '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: currentStep >= 2 ? '2px solid #1890ff' : '2px solid #d9d9d9'
                                    }}>
                                        <ShoppingCartOutlined style={{
                                            color: currentStep >= 2 ? '#fff' : '#666',
                                            fontSize: '16px'
                                        }} />
                                    </div>
                                ),
                                status: currentStep >= 2 ? 'process' : 'wait',
                                disabled: !selectedClient
                            }
                        ]}
                    />

                    {/* 步骤内容 */}
                    <div style={{ marginTop: 24 }}>
                        {currentStep === 0 && (
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
                        )}
                        {currentStep === 1 && (
                            <QuotationsTab
                                quotations={quotations}
                                selectedClient={selectedClient}
                                services={services}
                                onServicesChange={setSelectedServices}
                            />
                        )}
                        {currentStep === 2 && (
                            <OrderTab
                                selectedClient={selectedClient}
                                selectedServices={selectedServices}
                                projectData={form.getFieldsValue()}
                            />
                        )}
                    </div>

                    {/* 步骤导航按钮 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 24,
                        paddingTop: 24,
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        <Button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                        >
                            上一步
                        </Button>
                        <div>
                            {currentStep < 2 ? (
                                <Button
                                    type="primary"
                                    onClick={handleNext}
                                    disabled={currentStep === 0 && !selectedClient}
                                >
                                    下一步
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    loading={loading}
                                    onClick={() => form.submit()}
                                    size="large"
                                >
                                    保存项目
                                </Button>
                            )}
                        </div>
                    </div>

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