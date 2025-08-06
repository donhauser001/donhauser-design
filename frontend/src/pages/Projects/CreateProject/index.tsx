import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Space, Steps, Tag, Input } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, FileTextOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from './hooks';
import { createProject, validateProjectData } from './services';
import { ProjectFormData } from './types';
import BasicInfoTab from './components/BasicInfoTab';
import QuotationsTab from './components/QuotationsTab';
import OrderTab from './components/OrderTab';

// 数据持久化键名
const STORAGE_KEYS = {
    CURRENT_STEP: 'createProject_currentStep',
    SELECTED_SERVICES: 'createProject_selectedServices',
    SELECTED_SERVICE_IDS: 'createProject_selectedServiceIds',
    SERVICE_QUANTITIES: 'createProject_serviceQuantities',
    FORM_DATA: 'createProject_formData',
    SELECTED_CLIENT_ID: 'createProject_selectedClientId',
    SELECTED_CONTACTS: 'createProject_selectedContacts'
};

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // 从localStorage恢复所有状态
    const [currentStep, setCurrentStep] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
        return saved ? parseInt(saved) : 0;
    });
    
    const [selectedServices, setSelectedServices] = useState<any[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_SERVICES);
        return saved ? JSON.parse(saved) : [];
    });
    
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_SERVICE_IDS);
        return saved ? JSON.parse(saved) : [];
    });
    
    const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SERVICE_QUANTITIES);
        return saved ? JSON.parse(saved) : {};
    });

    const {
        clients,
        contacts,
        enterprises,
        designers,
        services,
        selectedClient,
        tasks,
        quotations,
        pricingPolicies,
        filteredContacts,
        handleClientChange,
        handleContactChange,
        addTask,
        removeTask,
        updateTask,
        calculateSubtotal
    } = useCreateProject();

    // 数据持久化函数
    const saveToStorage = useCallback((key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }, []);

    const loadFromStorage = useCallback((key: string, defaultValue: any) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error('加载数据失败:', error);
            return defaultValue;
        }
    }, []);

    // 清空所有暂存数据
    const clearStoredData = useCallback(() => {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        form.resetFields();
        handleClientChange('');
        setSelectedServices([]);
        setSelectedServiceIds([]);
        setServiceQuantities({});
        setCurrentStep(0);
    }, [form, handleClientChange]);

    // 恢复表单数据
    const restoreFormData = useCallback(() => {
        const savedFormData = loadFromStorage(STORAGE_KEYS.FORM_DATA, {});
        const savedClientId = loadFromStorage(STORAGE_KEYS.SELECTED_CLIENT_ID, '');
        const savedContacts = loadFromStorage(STORAGE_KEYS.SELECTED_CONTACTS, []);

        // 设置表单初始值
        form.setFieldsValue({
            progressStatus: 'consulting',
            settlementStatus: 'unpaid',
            mainDesigners: [],
            assistantDesigners: [],
            ...savedFormData
        });

        // 恢复客户选择
        if (savedClientId && clients.length > 0) {
            const client = clients.find(c => c._id === savedClientId);
            if (client) {
                handleClientChange(savedClientId);
            }
        }

        // 恢复联系人选择
        if (savedContacts.length > 0) {
            form.setFieldsValue({ contactIds: savedContacts });
        }
    }, [form, clients, handleClientChange, loadFromStorage]);

    // 监听表单变化并保存
    const handleFormValuesChange = useCallback((changedValues: any, allValues: any) => {
        saveToStorage(STORAGE_KEYS.FORM_DATA, allValues);
        
        // 如果客户发生变化，保存客户ID
        if (changedValues.clientId !== undefined) {
            saveToStorage(STORAGE_KEYS.SELECTED_CLIENT_ID, changedValues.clientId);
        }
        
        // 如果联系人发生变化，保存联系人ID
        if (changedValues.contactIds !== undefined) {
            saveToStorage(STORAGE_KEYS.SELECTED_CONTACTS, changedValues.contactIds);
        }
    }, [saveToStorage]);

    // 监听客户变化并保存
    useEffect(() => {
        if (selectedClient) {
            saveToStorage(STORAGE_KEYS.SELECTED_CLIENT_ID, selectedClient._id);
        }
    }, [selectedClient, saveToStorage]);

    // 监听步骤变化并保存
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.CURRENT_STEP, currentStep);
    }, [currentStep, saveToStorage]);

    // 监听服务选择变化并保存
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.SELECTED_SERVICES, selectedServices);
    }, [selectedServices, saveToStorage]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.SELECTED_SERVICE_IDS, selectedServiceIds);
    }, [selectedServiceIds, saveToStorage]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.SERVICE_QUANTITIES, serviceQuantities);
    }, [serviceQuantities, saveToStorage]);

    // 初始化时恢复数据
    useEffect(() => {
        if (clients.length > 0) {
            restoreFormData();
        }
    }, [clients, restoreFormData]);

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

            // 清空所有暂存数据
            clearStoredData();

            // 跳转到项目列表
            navigate('/projects');
        } catch (error) {
            console.error('提交失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (step: number) => {
        setCurrentStep(step);
    };

    const handleQuantityChange = (serviceId: string, quantity: number) => {
        setServiceQuantities(prev => ({
            ...prev,
            [serviceId]: quantity
        }));
        
        // 同时更新selectedServices中的数量
        setSelectedServices(prev => 
            prev.map(service => 
                service._id === serviceId 
                    ? { ...service, quantity } 
                    : service
            )
        );
    };

    const handlePricingPolicyChange = (serviceId: string, policyIds: string[]) => {
        setSelectedServices(prev => 
            prev.map(service => 
                service._id === serviceId 
                    ? { ...service, selectedPricingPolicies: policyIds } 
                    : service
            )
        );
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
                            onClick={clearStoredData}
                            size="small"
                        >
                            清空暂存
                        </Button>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            返回列表
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
                    onValuesChange={handleFormValuesChange}
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
                                description: `已选${selectedServices.length}个服务项目`,
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
                                status: currentStep >= 1 ? 'process' : 'wait'
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
                                status: currentStep >= 2 ? 'process' : 'wait'
                            }
                        ]}
                    />

                    <div style={{ display: 'flex', gap: '24px' }}>
                        {/* 主要内容区域 */}
                        <div style={{ flex: 1 }}>
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
                                    form={form}
                                />
                            )}
                            {currentStep === 1 && (
                                <QuotationsTab
                                    quotations={quotations}
                                    selectedClient={selectedClient}
                                    services={services}
                                    onServicesChange={setSelectedServices}
                                    selectedServiceIds={selectedServiceIds}
                                    onSelectedServiceIdsChange={setSelectedServiceIds}
                                    serviceQuantities={serviceQuantities}
                                    onServiceQuantitiesChange={setServiceQuantities}
                                />
                            )}
                            {currentStep === 2 && (
                                <OrderTab
                                    selectedClient={selectedClient}
                                    selectedServices={selectedServices}
                                    projectData={{
                                        projectName: form.getFieldValue('projectName'),
                                        undertakingTeam: form.getFieldValue('undertakingTeam'),
                                        mainDesigners: form.getFieldValue('mainDesigners'),
                                        assistantDesigners: form.getFieldValue('assistantDesigners'),
                                        clientRequirements: form.getFieldValue('clientRequirements'),
                                        remark: form.getFieldValue('remark')
                                    }}
                                    selectedContacts={filteredContacts.filter(c =>
                                        form.getFieldValue('contactIds')?.includes(c._id)
                                    )}
                                    enterprises={enterprises}
                                    designers={designers}
                                    pricingPolicies={pricingPolicies}
                                    onServiceQuantityChange={handleQuantityChange}
                                    onPricingPolicyChange={handlePricingPolicyChange}
                                />
                            )}
                        </div>
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