import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Space, Steps, Tag, Input, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, FileTextOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from './hooks';
import { createProject } from './services';
import { ProjectFormData } from './types';
import BasicInfoTab from './components/BasicInfoTab';
import QuotationsTab from './components/QuotationsTab';
import OrderTab from './components/OrderTab';
import SaveConfirmModal from './components/SaveConfirmModal';

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
    const [saveModalVisible, setSaveModalVisible] = useState(false);

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

    // 数据验证函数
    const validateProjectData = (values: ProjectFormData) => {
        if (!values.projectName) {
            message.error('请输入项目名称');
            return false;
        }
        if (!values.clientId) {
            message.error('请选择客户');
            return false;
        }
        if (!values.contactIds?.length) {
            message.error('请选择联系人');
            return false;
        }
        if (!values.undertakingTeam) {
            message.error('请选择承接团队');
            return false;
        }
        if (!values.mainDesigners?.length) {
            message.error('请选择主创设计师');
            return false;
        }
        if (!selectedServices.length) {
            message.error('请选择至少一个服务项目');
            return false;
        }
        return true;
    };

    // 计算金额
    const calculateAmounts = () => {
        const totalAmount = selectedServices.reduce((sum, service) => {
            const priceResult = calculatePrice(service);
            return sum + priceResult.discountedPrice;
        }, 0);

        const originalAmount = selectedServices.reduce((sum, service) => {
            return sum + (service.unitPrice * service.quantity);
        }, 0);

        const discountAmount = originalAmount - totalAmount;

        return { totalAmount, originalAmount, discountAmount };
    };

    // 构建项目数据
    const buildProjectData = (values: ProjectFormData, action: 'order' | 'draft') => {
        const client = clients.find(c => c._id === values.clientId);
        const selectedContacts = contacts.filter(c => values.contactIds?.includes(c._id));
        const enterprise = enterprises.find(e => e._id === values.undertakingTeam);
        const mainDesigners = designers.filter(d => values.mainDesigners?.includes(d._id));
        const assistantDesigners = designers.filter(d => values.assistantDesigners?.includes(d._id));

        return {
            projectName: values.projectName,
            clientId: values.clientId,
            clientName: client?.name,
            contactIds: values.contactIds,
            contactNames: selectedContacts.map(c => c.realName).join(', '),
            contactPhones: selectedContacts.map(c => c.phone).join(', '),
            undertakingTeam: values.undertakingTeam,
            undertakingTeamName: enterprise?.enterpriseName,
            mainDesigners: values.mainDesigners,
            mainDesignerNames: mainDesigners.map(d => d.realName).join(', '),
            assistantDesigners: values.assistantDesigners,
            assistantDesignerNames: assistantDesigners.map(d => d.realName).join(', '),
            clientRequirements: values.clientRequirements,
            remark: values.remark,
            progressStatus: action === 'order' ? 'in-progress' : 'consulting',
            settlementStatus: 'unpaid',
            ...calculateAmounts()
        };
    };

    // 处理保存确认
    const handleSaveConfirm = async (action: 'order' | 'draft') => {
        try {
            setLoading(true);

            const values = form.getFieldsValue();

            // 验证数据
            if (!validateProjectData(values)) {
                return;
            }

            // 构建项目数据
            const projectData = buildProjectData(values, action);

            // 处理服务数据
            const servicesData = selectedServices.map(service => ({
                serviceId: service._id,
                serviceName: service.serviceName,
                quantity: service.quantity,
                unitPrice: service.unitPrice,
                unit: service.unit,
                subtotal: service.unitPrice * service.quantity,
                pricingPolicies: service.selectedPricingPolicies || [],
                pricingPolicyNames: getPricingPolicyNames(service.selectedPricingPolicies || []),
                discountAmount: calculateServiceDiscount(service),
                finalAmount: calculateServiceFinalAmount(service)
            }));

            // 创建项目
            await createProject(projectData, servicesData);

            // 显示成功消息
            const actionText = action === 'order' ? '下单' : '暂存';
            message.success(`项目${actionText}成功`);

            // 清空所有暂存数据
            clearStoredData();

            // 跳转到项目列表
            navigate('/projects');
        } catch (error) {
            console.error('保存失败:', error);
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
            setSaveModalVisible(false);
        }
    };

    // 显示保存确认模态窗
    const showSaveModal = () => {
        const values = form.getFieldsValue();
        if (!validateProjectData(values)) {
            return;
        }
        setSaveModalVisible(true);
    };

    // 计算服务价格（从OrderTab复制）
    const calculatePrice = (service: any) => {
        const originalPrice = service.unitPrice * service.quantity;

        if (!service.selectedPricingPolicies || service.selectedPricingPolicies.length === 0) {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                discountAmount: 0
            };
        }

        let selectedPolicy = null;

        if (service.selectedPricingPolicies && service.selectedPricingPolicies.length > 0) {
            const selectedPolicyId = service.selectedPricingPolicies[0];

            selectedPolicy = pricingPolicies.find(p => p._id === selectedPolicyId);

            if (service.pricingPolicyIds && service.pricingPolicyNames) {
                const selectedIndex = service.pricingPolicyIds.indexOf(selectedPolicyId);
                if (selectedIndex !== -1) {
                    const expectedPolicyName = service.pricingPolicyNames[selectedIndex];

                    if (selectedPolicy && selectedPolicy.name !== expectedPolicyName && selectedPolicy.alias !== expectedPolicyName) {
                        selectedPolicy = pricingPolicies.find(p => p.name === expectedPolicyName || p.alias === expectedPolicyName);
                    }
                }
            }
        }

        if (!selectedPolicy || selectedPolicy.status !== 'active') {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                discountAmount: 0
            };
        }

        let discountedPrice = originalPrice;

        if (selectedPolicy.type === 'uniform_discount') {
            const discountRatio = selectedPolicy.discountRatio || 100;
            discountedPrice = (originalPrice * discountRatio) / 100;
        } else if (selectedPolicy.type === 'tiered_discount' && selectedPolicy.tierSettings) {
            const unitPrice = service.unitPrice;
            let totalDiscountedPrice = 0;

            const sortedTiers = [...selectedPolicy.tierSettings].sort((a, b) => (a.startQuantity || 0) - (b.startQuantity || 0));
            let remainingQuantity = service.quantity;

            for (const tier of sortedTiers) {
                if (remainingQuantity <= 0) break;

                const startQuantity = tier.startQuantity || 0;
                const endQuantity = tier.endQuantity || Infinity;
                const discountRatio = tier.discountRatio || 100;

                let tierQuantity = 0;
                if (endQuantity === Infinity) {
                    tierQuantity = remainingQuantity;
                } else {
                    const tierCapacity = endQuantity - startQuantity + 1;
                    tierQuantity = Math.min(remainingQuantity, tierCapacity);
                }

                if (tierQuantity > 0) {
                    const tierPrice = unitPrice * tierQuantity;
                    const tierDiscountedPrice = (tierPrice * discountRatio) / 100;
                    totalDiscountedPrice += tierDiscountedPrice;
                    remainingQuantity -= tierQuantity;
                }
            }

            discountedPrice = totalDiscountedPrice;
        }

        const discountAmount = originalPrice - discountedPrice;

        return {
            originalPrice,
            discountedPrice,
            discountAmount
        };
    };

    // 获取定价政策名称
    const getPricingPolicyNames = (policyIds: string[]) => {
        return policyIds.map(id => {
            const policy = pricingPolicies.find(p => p._id === id);
            return policy?.name || policy?.alias || '未知政策';
        }).join(', ');
    };

    // 计算服务折扣金额
    const calculateServiceDiscount = (service: any) => {
        const priceResult = calculatePrice(service);
        return priceResult.discountAmount;
    };

    // 计算服务最终金额
    const calculateServiceFinalAmount = (service: any) => {
        const priceResult = calculatePrice(service);
        return priceResult.discountedPrice;
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
                                    onClick={showSaveModal}
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

            {/* 保存确认模态窗 */}
            <SaveConfirmModal
                visible={saveModalVisible}
                onCancel={() => setSaveModalVisible(false)}
                onConfirm={handleSaveConfirm}
                loading={loading}
                projectData={buildProjectData(form.getFieldsValue(), 'order')}
                selectedServices={selectedServices}
                {...calculateAmounts()}
            />
        </div>
    );
};

export default CreateProject; 