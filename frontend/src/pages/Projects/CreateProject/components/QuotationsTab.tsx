import React, { useState, useEffect, useMemo } from 'react';
import { Card, Empty, Tag, Typography, Row, Col, Collapse, InputNumber, Checkbox } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { Quotation, Service } from '../types';
import dayjs from 'dayjs';



const { Title, Text, Paragraph } = Typography;

interface QuotationsTabProps {
    quotations: Quotation[];
    selectedClient: any;
    services: Service[];
    onServicesChange?: (services: any[]) => void;
    selectedServiceIds?: string[];
    onSelectedServiceIdsChange?: (ids: string[]) => void;
    serviceQuantities?: Record<string, number>;
    onServiceQuantitiesChange?: (quantities: Record<string, number>) => void;
}

interface ServiceWithDetails extends Service {
    categoryName?: string;
    alias?: string;
    pricingPolicyIds?: string[];
    pricingPolicyNames?: string[];
}

const QuotationsTab: React.FC<QuotationsTabProps> = ({
    quotations,
    selectedClient,
    onServicesChange,
    selectedServiceIds = [],
    onSelectedServiceIdsChange,
    serviceQuantities = {},
    onServiceQuantitiesChange
}) => {
    const [serviceDetails, setServiceDetails] = useState<ServiceWithDetails[]>([]);

    // 获取服务详细信息
    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (quotations.length > 0 && quotations[0].selectedServices.length > 0) {
                try {
                    const serviceIds = quotations[0].selectedServices;

                    // 完全重新获取，避免重复
                    const details = await Promise.all(
                        serviceIds.map(async (serviceId) => {
                            const response = await fetch(`/api/service-pricing/${serviceId}`);
                            const data = await response.json();
                            return data.success ? data.data : null;
                        })
                    );

                    const validDetails = details.filter(Boolean);
                    // 去重，确保每个服务只出现一次
                    const uniqueDetails = validDetails.filter((service, index, self) =>
                        index === self.findIndex(s => s._id === service._id)
                    );
                    setServiceDetails(uniqueDetails);
                } catch (error) {
                    console.error('获取服务详情失败:', error);
                }
            } else {
                // 如果没有报价单或服务，清空服务详情
                setServiceDetails([]);
            }
        };

        fetchServiceDetails();
    }, [quotations.length, quotations[0]?.selectedServices?.join(',')]);

    // 按分类分组服务，确保去重
    const groupedServices = useMemo(() => {
        // 先对服务详情进行去重
        const uniqueServices = serviceDetails.filter((service, index, self) =>
            index === self.findIndex(s => s._id === service._id)
        );

        return uniqueServices.reduce((acc, service) => {
            const category = service.categoryName || '未分类';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(service);
            return acc;
        }, {} as Record<string, ServiceWithDetails[]>);
    }, [serviceDetails]);

    const handleServiceToggle = (serviceId: string, checked: boolean) => {
        if (checked) {
            onSelectedServiceIdsChange?.([...selectedServiceIds, serviceId]);
            // 默认设置数量为1
            onServiceQuantitiesChange?.({ ...serviceQuantities, [serviceId]: 1 });
        } else {
            onSelectedServiceIdsChange?.(selectedServiceIds.filter(id => id !== serviceId));
            // 移除数量设置
            const newQuantities = { ...serviceQuantities };
            delete newQuantities[serviceId];
            onServiceQuantitiesChange?.(newQuantities);
        }
    };

    const handleQuantityChange = (serviceId: string, quantity: number) => {
        onServiceQuantitiesChange?.({ ...serviceQuantities, [serviceId]: quantity });
    };

    const handleAddToOrder = () => {
        const selectedItems = selectedServiceIds.map(serviceId => {
            const service = serviceDetails.find(s => s._id === serviceId);
            const quantity = serviceQuantities[serviceId] || 1;
            return { service, quantity };
        });

        console.log('添加到订单:', selectedItems);
        // 这里可以添加将选中服务添加到订单的逻辑
    };

    // 监听选中服务变化，通知父组件
    useEffect(() => {
        if (onServicesChange) {
            const selectedItems = selectedServiceIds.map(serviceId => {
                const service = serviceDetails.find(s => s._id === serviceId);
                const quantity = serviceQuantities[serviceId] || 1;
                return {
                    ...service,
                    quantity
                };
            });
            onServicesChange(selectedItems);
        }
    }, [selectedServiceIds, serviceQuantities, serviceDetails, onServicesChange]);
    if (!selectedClient) {
        return (
            <div>
                <Card
                    size="small"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileTextOutlined style={{ color: '#666' }} />
                            <span>报价单信息</span>
                            <Tag color="blue">包含服务项目 0 项</Tag>
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
                            <FileTextOutlined style={{ color: '#666' }} />
                            <span>报价单信息</span>
                            <Tag color="blue">包含服务项目 0 项</Tag>
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
                        <FileTextOutlined style={{ color: '#666' }} />
                        <span>报价单信息</span>
                        <Tag color="blue">包含服务项目 {quotations.length > 0 ? quotations[0].selectedServices.length : 0} 项</Tag>
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
                        styles={{ body: { padding: '16px' } }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileTextOutlined style={{ color: '#666' }} />
                                    {quotation.name}
                                    <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                        创建时间: {dayjs(quotation.createTime).format('YYYY-MM-DD')} | 有效期至: {quotation.validUntil ? dayjs(quotation.validUntil).format('YYYY-MM-DD') : '长期有效'}
                                    </Text>
                                </Title>
                                {quotation.isDefault && (
                                    <Tag color="gold" style={{ marginLeft: '8px' }}>
                                        默认报价单
                                    </Tag>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag color="blue">已选择: {selectedServiceIds.length} 项</Tag>
                                <Tag color={quotation.status === 'active' ? 'green' : 'red'}>
                                    {quotation.status === 'active' ? '有效' : '无效'}
                                </Tag>
                            </div>
                        </div>

                        {quotation.description && (
                            <Paragraph style={{ marginBottom: '12px', color: '#666' }}>
                                {quotation.description}
                            </Paragraph>
                        )}

                        <div style={{ marginTop: '12px' }}>
                            <div style={{ marginTop: '12px' }}>
                                <Collapse
                                    ghost
                                    size="small"
                                    style={{ background: 'transparent' }}
                                    items={Object.entries(groupedServices).map(([category, categoryServices]) => ({
                                        key: category,
                                        label: (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                                                    {category}
                                                </span>
                                                <Tag color="blue">{categoryServices.length} 项</Tag>
                                            </div>
                                        ),
                                        children: (
                                            <div style={{ paddingLeft: '16px' }}>
                                                <Row gutter={[16, 16]}>
                                                    {categoryServices.map((service) => (
                                                        <Col xs={24} sm={12} md={8} lg={6} key={service._id}>
                                                            <Card
                                                                size="small"
                                                                hoverable
                                                                style={{
                                                                    border: selectedServiceIds.includes(service._id)
                                                                        ? '2px solid #1890ff'
                                                                        : '1px solid #f0f0f0',
                                                                    borderRadius: '8px',
                                                                    transition: 'all 0.3s ease',
                                                                    background: selectedServiceIds.includes(service._id)
                                                                        ? '#f6ffed'
                                                                        : '#ffffff'
                                                                }}
                                                                styles={{ body: { padding: '12px' } }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                                                    <Checkbox
                                                                        checked={selectedServiceIds.includes(service._id)}
                                                                        onChange={(e) => handleServiceToggle(service._id, e.target.checked)}
                                                                    />
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'flex-start',
                                                                            marginBottom: '4px'
                                                                        }}>
                                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                                <Text strong style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                                                                    {service.serviceName}
                                                                                </Text>
                                                                            </div>
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '4px',
                                                                                marginLeft: '8px',
                                                                                flexShrink: 0
                                                                            }}>
                                                                                <Text type="danger" strong style={{ fontSize: '16px' }}>
                                                                                    ¥{service.unitPrice}
                                                                                </Text>
                                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                                    /{service.unit}
                                                                                </Text>
                                                                            </div>
                                                                        </div>
                                                                        {service.alias && (
                                                                            <div style={{ marginBottom: '4px' }}>
                                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                                    {service.alias}
                                                                                </Text>
                                                                            </div>
                                                                        )}
                                                                        <div style={{ marginBottom: '4px' }}>
                                                                            <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
                                                                                价格说明：按{service.unit}计费
                                                                            </Text>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div style={{ marginBottom: '8px' }}>
                                                                    {service.pricingPolicyIds && service.pricingPolicyIds.length > 0 ? (
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            flexWrap: 'wrap',
                                                                            gap: '2px',
                                                                            justifyContent: 'flex-end'
                                                                        }}>
                                                                            {service.pricingPolicyNames?.map((policyName, index) => (
                                                                                <Tag key={index} color="green" style={{ fontSize: '12px' }}>
                                                                                    {policyName}
                                                                                </Tag>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ textAlign: 'right' }}>
                                                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                                无政策
                                                                            </Text>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {selectedServiceIds.includes(service._id) && (
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        padding: '8px',
                                                                        background: '#f0f8ff',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #d6e4ff'
                                                                    }}>
                                                                        <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                                                            数量:
                                                                        </Text>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                            <InputNumber
                                                                                min={1}
                                                                                max={999}
                                                                                value={serviceQuantities[service._id] || 1}
                                                                                size="small"
                                                                                style={{ width: '50px' }}
                                                                                onChange={(value) => handleQuantityChange(service._id, value || 1)}
                                                                            />
                                                                            <Text type="secondary" style={{ fontSize: '12px' }}>{service.unit}</Text>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        )
                                    }))}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </Card>
        </div>
    );
};

export default QuotationsTab; 