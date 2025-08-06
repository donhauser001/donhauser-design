import React, { useState, useEffect } from 'react';
import { Card, Empty, Tag, Typography, Space, Divider, Checkbox, Row, Col, Collapse } from 'antd';
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
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [serviceDetails, setServiceDetails] = useState<ServiceWithDetails[]>([]);

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

    const handleServiceToggle = (serviceId: string, checked: boolean) => {
        if (checked) {
            setSelectedServices(prev => [...prev, serviceId]);
        } else {
            setSelectedServices(prev => prev.filter(id => id !== serviceId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedServices(serviceDetails.map(service => service._id));
        } else {
            setSelectedServices([]);
        }
    };

    const isAllSelected = serviceDetails.length > 0 && selectedServices.length === serviceDetails.length;
    const isIndeterminate = selectedServices.length > 0 && selectedServices.length < serviceDetails.length;
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Text strong>包含服务项目 ({quotation.selectedServices.length} 项):</Text>
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    >
                                        全选
                                    </Checkbox>
                                </div>
                                <div>
                                    <Tag color="blue">已选择: {selectedServices.length} 项</Tag>
                                    {selectedServices.length > 0 && (
                                        <Tag color="green">
                                            总价: ¥{serviceDetails
                                                .filter(service => selectedServices.includes(service._id))
                                                .reduce((sum, service) => sum + service.unitPrice, 0)
                                                .toLocaleString()}
                                        </Tag>
                                    )}
                                </div>
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
                                                            <Col span={1}>
                                                                <Checkbox
                                                                    checked={selectedServices.includes(service._id)}
                                                                    onChange={(e) => handleServiceToggle(service._id, e.target.checked)}
                                                                />
                                                            </Col>
                                                            <Col span={8}>
                                                                <div>
                                                                    <Text strong>{service.serviceName}</Text>
                                                                    {service.alias && (
                                                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                                            别名: {service.alias}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col span={4}>
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <Text type="danger" strong>
                                                                        ¥{service.unitPrice}
                                                                    </Text>
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                                        /{service.unit}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div>
                                                                    {service.pricingPolicyIds && service.pricingPolicyIds.length > 0 ? (
                                                                        <div>
                                                                            <Tag color="green" icon={<CheckCircleOutlined />}>
                                                                                已关联定价政策
                                                                            </Tag>
                                                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                                                {service.pricingPolicyNames?.join(', ')}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <Tag color="orange">无定价政策</Tag>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col span={5}>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <Tag color="blue">
                                                                        已选择: {selectedServices.includes(service._id) ? '是' : '否'}
                                                                    </Tag>
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