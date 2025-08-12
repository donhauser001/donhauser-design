import React, { useEffect } from 'react';
import { Table, Alert, Typography, Radio, InputNumber, Button, Card, Divider } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore, OrderItem } from '../../../../stores/formDesignerStore';
import { convertToRMB } from '../../../RMBAmountConverter';

const { Text } = Typography;

interface OrderComponentProps {
    component: FormComponent;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ component }) => {
        const { 
        components, 
        getOrderItems, 
        getOrderTotal,
        updateOrderItemQuantity,
        updateOrderItemPolicies,
        removeServiceFromOrder,
        loadPricingPolicies,
        pricingPolicies,
        clearOrderItems,
        addOrderItems
    } = useFormDesignerStore();

    // 检查画布上是否存在报价单组件或项目名称组件
    const hasQuotationComponent = components.some((comp: FormComponent) => comp.type === 'quotation');
    const hasProjectNameComponent = components.some((comp: FormComponent) => comp.type === 'projectName');
    const canUseOrderComponent = hasQuotationComponent || hasProjectNameComponent;

    // 获取当前订单项目
    const orderItems = getOrderItems(component.id);
    const orderTotal = getOrderTotal(component.id);

    // 加载价格政策数据
    useEffect(() => {
        if (pricingPolicies.length === 0) {
            loadPricingPolicies();
        }
    }, []);

    // 获取选中的项目ID（从项目名称组件的componentValues中获取）
    const getSelectedProjectId = (): string | null => {
        const projectNameComponent = components.find(comp => comp.type === 'projectName');
        if (!projectNameComponent) return null;
        
        const { getComponentValue } = useFormDesignerStore.getState();
        const selectedProject = getComponentValue(projectNameComponent.id);
        
        // selectedProject可能是项目对象或项目ID字符串
        if (typeof selectedProject === 'object' && selectedProject?._id) {
            return selectedProject._id;
        } else if (typeof selectedProject === 'string') {
            return selectedProject;
        }
        
        return null;
    };

    // 获取项目任务并转换为订单项目
    const loadProjectTasks = async (projectId: string) => {
        try {
            const response = await fetch(`/api/tasks/project/${projectId}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                // 将任务转换为订单项目格式
                const taskOrderItems: OrderItem[] = data.data.map((task: any) => ({
                    id: task._id,
                    serviceName: task.taskName,
                    categoryName: '项目任务', // 统一分类
                    unitPrice: task.subtotal / task.quantity, // 计算单价
                    unit: task.unit,
                    quantity: task.quantity,
                    priceDescription: task.billingDescription || `${task.taskName}相关任务`,
                    pricingPolicyIds: task.pricingPolicies?.map((p: any) => p.policyId) || [],
                    pricingPolicyNames: task.pricingPolicies?.map((p: any) => p.policyName) || [],
                    selectedPolicies: [],
                    subtotal: task.subtotal,
                    originalPrice: task.subtotal,
                    discountAmount: 0,
                    calculationDetails: task.billingDescription || `按${task.unit}计费`
                }));

                // 清空现有订单项目并添加任务项目
                clearOrderItems(component.id);
                addOrderItems(component.id, taskOrderItems);
            }
        } catch (error) {
            console.error('获取项目任务失败:', error);
        }
    };

    // 监听关联模式和项目选择变化
    useEffect(() => {
        if (component.associationMode === 'project') {
            const projectId = getSelectedProjectId();
            if (projectId) {
                loadProjectTasks(projectId);
            } else {
                // 如果没有选中项目，清空订单
                clearOrderItems(component.id);
            }
        }
    }, [component.associationMode, components]);

    // 监听项目名称组件的值变化
    useEffect(() => {
        if (component.associationMode === 'project') {
            const projectNameComponent = components.find(comp => comp.type === 'projectName');
            if (projectNameComponent) {
                const projectId = getSelectedProjectId();
                if (projectId) {
                    loadProjectTasks(projectId);
                } else {
                    clearOrderItems(component.id);
                }
            }
        }
    }, [components.find(comp => comp.type === 'projectName')?.id]);

    // 如果没有报价单组件或项目名称组件，显示提示信息
    if (!canUseOrderComponent) {
        return (
            <div style={{ width: '100%' }}>
                <Alert
                    message="订单组件无法独立使用，请先在画布中添加报价单或项目名称组件"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{
                        fontSize: '12px'
                    }}
                />
                {component.fieldDescription && (
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px',
                        lineHeight: '1.4'
                    }}>
                        {component.fieldDescription}
                    </div>
                )}
            </div>
        );
    }

    // 处理数量变更
    const handleQuantityChange = (serviceId: string, quantity: number) => {
        updateOrderItemQuantity(component.id, serviceId, quantity);
    };

    // 处理政策选择变更
    const handlePolicyChange = (serviceId: string, policyIds: string[]) => {
        updateOrderItemPolicies(component.id, serviceId, policyIds);
    };

    // 处理删除订单项
    const handleRemoveItem = (serviceId: string) => {
        removeServiceFromOrder(component.id, serviceId);
    };

    // 定义表格列
    const columns = [
        {
            title: '服务项目',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: '20%',
            render: (text: string, record: OrderItem) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.categoryName}
                    </Text>
                </div>
            )
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: '12%',
            render: (price: number, record: OrderItem) => (
                <Text strong>
                    ¥{price.toLocaleString()}/{record.unit}
                </Text>
            )
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
            render: (quantity: number, record: OrderItem) => (
                <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record.id, value || 1)}
                    size="small"
                    style={{ width: '80px' }}
                />
            )
        },
        {
            title: '价格政策',
            dataIndex: 'pricingPolicyNames',
            key: 'pricingPolicyNames',
            width: '15%',
            render: (policyNames: string[], record: OrderItem) => {
                if (!policyNames || policyNames.length === 0) {
                    return <Text type="secondary">无</Text>;
                }

                return (
                    <Radio.Group
                        value={record.selectedPolicies?.[0] || null}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            handlePolicyChange(record.id, selectedValue ? [selectedValue] : []);
                        }}
                    >
                        <div style={{ marginBottom: '4px' }}>
                            <Radio value={null} style={{ fontSize: '12px' }}>
                                不使用政策
                            </Radio>
                        </div>
                        {policyNames.map((policyName, index) => {
                            const policyId = record.pricingPolicyIds?.[index] || '';
                            return (
                                <div key={policyId} style={{ marginBottom: '4px' }}>
                                    <Radio value={policyId} style={{ fontSize: '12px' }}>
                                        {policyName}
                                    </Radio>
                                </div>
                            );
                        })}
                    </Radio.Group>
                );
            }
        },
        {
            title: '小计',
            dataIndex: 'subtotal',
            key: 'subtotal',
            width: '12%',
            render: (subtotal: number) => (
                <Text strong style={{ color: '#1890ff' }}>
                    ¥{subtotal.toLocaleString()}
                </Text>
            )
        },
        {
            title: '价格说明',
            dataIndex: 'calculationDetails',
            key: 'calculationDetails',
            width: '25%',
            render: (calculationDetails: string, record: OrderItem) => {
                const details = calculationDetails || record.priceDescription || '—';
                return (
                    <div style={{ fontSize: '12px', color: '#666', whiteSpace: 'pre-line' }}>
                        {details}
                    </div>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            width: '8%',
            render: (_: any, record: OrderItem) => (
                <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.id)}
                />
            )
        }
    ];

    // 获取标题显示内容
    const getCardTitle = () => {
        const { titleDisplay = 'show', customTitle = '订单详情' } = component;
        
        if (titleDisplay === 'hide') {
            return undefined; // 不显示标题
        } else if (titleDisplay === 'custom') {
            return customTitle || '订单详情'; // 显示自定义标题
        } else {
            return '订单详情'; // 显示默认标题
        }
    };

    // 获取空订单时的提示信息
    const getEmptyOrderMessage = () => {
        const { associationMode = 'auto' } = component;
        
        // 根据关联模式返回不同的提示信息
        if (associationMode === 'project') {
            return '请在项目名称组件中选择一个项目';
        } else if (associationMode === 'quotation') {
            return '请在报价单中选择服务项目';
        } else if (associationMode === 'select') {
            return '请先在组件属性中选择关联模式';
        } else {
            // 自动模式或其他情况，根据画布上的组件情况决定
            if (hasQuotationComponent && !hasProjectNameComponent) {
                return '请在报价单中选择服务项目';
            } else if (!hasQuotationComponent && hasProjectNameComponent) {
                return '请在项目名称组件中选择一个项目';
            } else if (hasQuotationComponent && hasProjectNameComponent) {
                return '请先在组件属性中选择关联模式';
            } else {
                return '请添加报价单或项目名称组件';
            }
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <Card
                title={getCardTitle()}
                size="small"
                style={{ width: '100%' }}
                extra={
                    orderItems.length > 0 && (
                        <Text type="secondary">
                            共 {orderItems.length} 项服务
                        </Text>
                    )
                }
            >
                {orderItems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#999',
                        backgroundColor: '#fafafa',
                        borderRadius: '6px'
                    }}>
                        <Text type="secondary">
                            {getEmptyOrderMessage()}
                        </Text>
                    </div>
                ) : (
                    <>
                        <Table
                            dataSource={orderItems}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 'max-content' }}
                            style={{ marginBottom: '16px' }}
                        />
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{
                            textAlign: 'center',
                            backgroundColor: '#f8f9fa',
                            padding: '16px',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{ 
                                fontSize: '16px', 
                                fontWeight: 'bold',
                                marginBottom: '8px',
                                color: 'inherit'
                            }}>
                                总计：¥{orderTotal.toLocaleString()}
                            </div>
                            <div style={{ 
                                fontSize: '14px', 
                                color: '#666',
                                fontWeight: 'normal'
                            }}>
                                大写：{convertToRMB(orderTotal, true)}
                            </div>
                        </div>
                    </>
                )}
            </Card>

            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default OrderComponent; 