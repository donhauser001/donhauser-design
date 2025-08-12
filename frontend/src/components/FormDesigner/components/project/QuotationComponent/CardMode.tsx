import React from 'react';
import { Card, Typography, Row, Col, Divider } from 'antd';
import { RenderModeProps } from './types';

const { Text } = Typography;

export const CardMode: React.FC<RenderModeProps> = ({
    groupedServices,
    sortedCategories,
    component,
    renderPolicyTag,
    renderPriceDescriptionWithPolicy,
    hasOrderComponent,
    onServiceSelect
}) => {
    // 渲染服务卡片
    const renderServiceCard = (service: any) => (
        <Col key={service._id} span={6} style={{ marginBottom: '12px' }}>
            <Card
                size="small"
                style={{
                    height: '100%',
                    border: '1px solid #f0f0f0',
                    borderRadius: component.style?.borderRadius || '8px',
                    position: 'relative',
                    cursor: hasOrderComponent ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                }}
                bodyStyle={{ padding: '12px' }}
                hoverable={hasOrderComponent}
                onClick={() => hasOrderComponent && onServiceSelect(service)}
            >
                {/* 价格政策标签 */}
                {component.showPricingPolicy && service.pricingPolicyNames && service.pricingPolicyNames.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 1
                    }}>
                        {service.pricingPolicyNames.slice(0, 2).map((policyName: string, index: number) => {
                            const policyId = service.pricingPolicyIds?.[service.pricingPolicyNames.indexOf(policyName)] || '';
                            return renderPolicyTag(policyName, policyId, index, service, {
                                marginBottom: index < service.pricingPolicyNames.slice(0, 2).length - 1 ? '2px' : '0'
                            });
                        })}
                        {service.pricingPolicyNames.length > 2 && (
                            <div
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#8c8c8c',
                                    border: '1px solid #d9d9d9',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center',
                                    lineHeight: '1.2'
                                }}
                            >
                                +{service.pricingPolicyNames.length - 2}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '14px' }}>
                        {service.serviceName}
                    </Text>
                </div>

                <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '16px' }}>
                        ¥{service.unitPrice.toLocaleString()}{service.unit ? `/${service.unit}` : ''}
                    </Text>
                </div>

                {(service.priceDescription || (component.policyDetailMode === 'append' && component.showPricingPolicy && service.pricingPolicyNames?.length > 0)) && (
                    <div>
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                            {renderPriceDescriptionWithPolicy(service.priceDescription, service)}
                        </Text>
                    </div>
                )}
            </Card>
        </Col>
    );

    return (
        <>
            {sortedCategories.map((category, categoryIndex) => (
                <div key={category} style={{ marginBottom: '24px' }}>
                    {sortedCategories.length > 1 && (
                        <div style={{ marginBottom: '12px' }}>
                            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                {category}
                            </Text>
                        </div>
                    )}

                    <Row gutter={[12, 12]}>
                        {groupedServices[category].map(service => renderServiceCard(service))}
                    </Row>

                    {categoryIndex < sortedCategories.length - 1 && (
                        <Divider style={{ margin: '16px 0' }} />
                    )}
                </div>
            ))}
        </>
    );
};
