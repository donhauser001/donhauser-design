import React from 'react';
import { Card, Empty, Tag, Typography, Space, Divider } from 'antd';
import { FileTextOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { Quotation } from '../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface QuotationsTabProps {
    quotations: Quotation[];
    selectedClient: any;
}

const QuotationsTab: React.FC<QuotationsTabProps> = ({ quotations, selectedClient }) => {
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
                            <Text strong>包含服务项目 ({quotation.selectedServices.length} 项):</Text>
                            <div style={{ marginTop: '8px' }}>
                                {quotation.selectedServices.map((serviceId, serviceIndex) => (
                                    <Tag key={serviceIndex} color="blue" style={{ marginBottom: '4px' }}>
                                        服务项目 {serviceIndex + 1}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </Card>
        </div>
    );
};

export default QuotationsTab; 