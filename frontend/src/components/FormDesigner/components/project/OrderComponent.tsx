import React, { useEffect } from 'react';
import { Table, Alert, Typography, Radio, InputNumber, Button, Card, Divider } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore, OrderItem } from '../../../../stores/formDesignerStore';

const { Text, Title } = Typography;

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
        pricingPolicies
    } = useFormDesignerStore();

    // 检查画布上是否存在报价单组件
    const hasQuotationComponent = components.some((comp: FormComponent) => comp.type === 'quotation');

    // 获取当前订单项目
    const orderItems = getOrderItems(component.id);
    const orderTotal = getOrderTotal(component.id);

    // 加载价格政策数据
    useEffect(() => {
        if (pricingPolicies.length === 0) {
            loadPricingPolicies();
        }
    }, []);

    // 如果没有报价单组件，显示提示信息
    if (!hasQuotationComponent) {
        return (
            <div style={{ width: '100%' }}>
                <Alert
                    message="订单组件无法独立使用，请先在画布中添加报价单组件"
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

    return (
        <div style={{ width: '100%' }}>
            <Card
                title="订单详情"
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
                            请在报价单中选择服务项目
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
                            textAlign: 'right',
                            backgroundColor: '#f0f8ff',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            border: '1px solid #d9d9d9'
                        }}>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                总计：¥{orderTotal.toLocaleString()}
                            </Title>
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