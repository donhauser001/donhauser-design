import React, { useState, useEffect } from 'react';
import { Card, Empty, Tag, Typography, Space, Divider, Row, Col, Collapse, InputNumber, Button } from 'antd';
import { FileTextOutlined, CalendarOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Quotation, Service } from '../types';
import dayjs from 'dayjs';

const { Panel } = Collapse;

const { Title, Text, Paragraph } = Typography;

interface QuotationsTabProps {
    quotations: Quotation[];
    selectedClient: any;
    services: Service[];
}

interface ServiceWithDetails extends Service {
    categoryName?: string;
    alias?: string;
    pricingPolicyIds?: string[];
    pricingPolicyNames?: string[];
}

const QuotationsTab: React.FC<QuotationsTabProps> = ({ quotations, selectedClient, services }) => {
    const [serviceDetails, setServiceDetails] = useState<ServiceWithDetails[]>([]);
    const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});

    // 获取服务详细信息
    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (quotations.length > 0 && quotations[0].selectedServices.length > 0) {
                try {
                    const details = await Promise.all(
                        quotations[0].selectedServices.map(async (serviceId) => {
                            const response = await fetch(`/api/service-pricing/${serviceId}`);
                            const data = await response.json();
                            return data.success ? data.data : null;
                        })
                    );
                    setServiceDetails(details.filter(Boolean));
                } catch (error) {
                    console.error('获取服务详情失败:', error);
                }
            }
        };

        fetchServiceDetails();
    }, [quotations]);

    // 按分类分组服务
    const groupedServices = serviceDetails.reduce((acc, service) => {
        const category = service.categoryName || '未分类';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, ServiceWithDetails[]>);

    const handleQuantityChange = (serviceId: string, quantity: number) => {
        setServiceQuantities(prev => ({ ...prev, [serviceId]: quantity }));
    };

    const handleAddToOrder = (service: ServiceWithDetails) => {
        const quantity = serviceQuantities[service._id] || 1;
        // 这里可以添加将服务添加到订单的逻辑
        console.log('添加到订单:', { service, quantity });
        // 可以调用父组件的回调函数或使用其他状态管理方式
    };
    if (!selectedClient) {
        return (
            <div>
                <Card
                    size="small"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#1890ff' }}>📋</span>
                            <span>报价单信息</span>
                            <Tag color="blue">0 个报价单</Tag>
                        </div>
                    }
                    style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                >
                    <Empty
                        description="请先选择客户以查看关联的报价单"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            </div>
        );
    }

    if (quotations.length === 0) {
        return (
            <div>
                <Card
                    size="small"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#1890ff' }}>📋</span>
                            <span>报价单信息</span>
                            <Tag color="blue">0 个报价单</Tag>
                        </div>
                    }
                    style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                >
                    <Empty
                        description={`客户"${selectedClient.name}"暂无关联的报价单`}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#1890ff' }}>📋</span>
                        <span>报价单信息</span>
                        <Tag color="blue">{quotations.length} 个报价单</Tag>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                {quotations.map((quotation, index) => (
                    <Card
                        key={quotation._id}
                        size="small"
                        style={{
                            marginBottom: index < quotations.length - 1 ? '16px' : 0,
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px'
                        }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileTextOutlined style={{ color: '#1890ff' }} />
                                    {quotation.name}
                                </Title>
                                {quotation.isDefault && (
                                    <Tag color="gold" style={{ marginLeft: '8px' }}>
                                        默认报价单
                                    </Tag>
                                )}
                            </div>
                            <Tag color={quotation.status === 'active' ? 'green' : 'red'}>
                                {quotation.status === 'active' ? '有效' : '无效'}
                            </Tag>
                        </div>

                        {quotation.description && (
                            <Paragraph style={{ marginBottom: '12px', color: '#666' }}>
                                {quotation.description}
                            </Paragraph>
                        )}

                        <Space split={<Divider type="vertical" />} style={{ marginBottom: '12px' }}>
                            <Space>
                                <CalendarOutlined style={{ color: '#666' }} />
                                <Text type="secondary">创建时间: {dayjs(quotation.createTime).format('YYYY-MM-DD HH:mm')}</Text>
                            </Space>
                            {quotation.validUntil && (
                                <Space>
                                    <CalendarOutlined style={{ color: '#666' }} />
                                    <Text type="secondary">有效期至: {dayjs(quotation.validUntil).format('YYYY-MM-DD')}</Text>
                                </Space>
                            )}
                        </Space>

                        <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <Text strong>包含服务项目 ({quotation.selectedServices.length} 项):</Text>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <Collapse
                                    ghost
                                    size="small"
                                    style={{ background: 'transparent' }}
                                >
                                    {Object.entries(groupedServices).map(([category, categoryServices]) => (
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                                                        {category}
                                                    </span>
                                                    <Tag color="blue">{categoryServices.length} 项</Tag>
                                                </div>
                                            }
                                            key={category}
                                        >
                                            <div style={{ paddingLeft: '16px' }}>
                                                {categoryServices.map((service) => (
                                                    <div
                                                        key={service._id}
                                                        style={{
                                                            marginBottom: '12px',
                                                            padding: '12px',
                                                            border: '1px solid #f0f0f0',
                                                            borderRadius: '6px',
                                                            background: '#fafafa'
                                                        }}
                                                    >
                                                        <Row gutter={16} align="middle">
                                                            <Col span={8}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <Text strong>{service.serviceName}</Text>
                                                                    {service.alias && (
                                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                            ({service.alias})
                                                                        </Text>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col span={4}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <Text type="danger" strong>
                                                                        ¥{service.unitPrice}
                                                                    </Text>
                                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                        /{service.unit}
                                                                    </Text>
                                                                </div>
                                                            </Col>
                                                            <Col span={5}>
                                                                <div>
                                                                    {service.pricingPolicyIds && service.pricingPolicyIds.length > 0 ? (
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                            {service.pricingPolicyNames?.map((policyName, index) => (
                                                                                <Tag key={index} color="green" size="small">
                                                                                    {policyName}
                                                                                </Tag>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                            无政策
                                                                        </Text>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col span={3}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <InputNumber
                                                                        min={1}
                                                                        max={999}
                                                                        defaultValue={1}
                                                                        size="small"
                                                                        style={{ width: '60px' }}
                                                                        onChange={(value) => handleQuantityChange(service._id, value || 1)}
                                                                    />
                                                                    <Button
                                                                        type="primary"
                                                                        size="small"
                                                                        onClick={() => handleAddToOrder(service)}
                                                                    >
                                                                        添加到订单中
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ))}
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </div>
                        </div>
                    </Card>
                ))}
            </Card>
        </div>
    );
};

export default QuotationsTab; 