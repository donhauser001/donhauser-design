import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Divider, Empty, Spin, Row, Col, Tabs, Table, Tooltip, Modal } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { quotationService, QuotationWithServices } from '../../services/quotationService';
import PricePolicyCalculator, { formatCalculationDetails, calculatePriceWithPolicies } from '../../../PricePolicyCalculator';

const { Text, Title } = Typography;

interface QuotationComponentProps {
    component: FormComponent;
}

const QuotationComponent: React.FC<QuotationComponentProps> = ({ component }) => {
    const [selectedQuotation, setSelectedQuotation] = useState<QuotationWithServices | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [allPolicies, setAllPolicies] = useState<any[]>([]);
    const [policyModalVisible, setPolicyModalVisible] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
    const [selectedPolicyService, setSelectedPolicyService] = useState<any>(null);

    // 获取报价单状态的显示样式
    const getStatusTag = (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
            'active': { text: '有效', color: '#52c41a' },
            'inactive': { text: '已停用', color: '#f5222d' }
        };
        return statusMap[status] || { text: status, color: '#d9d9d9' };
    };

    // 加载报价单详情
    const loadQuotationDetail = async (quotationId: string) => {
        if (!quotationId) {
            setSelectedQuotation(null);
            return;
        }

        setLoading(true);
        try {
            const quotationDetail = await quotationService.getQuotationWithServices(quotationId);
            setSelectedQuotation(quotationDetail);
        } catch (error) {
            console.error('加载报价单详情失败:', error);
            setSelectedQuotation(null);
        } finally {
            setLoading(false);
        }
    };

    // 初始化默认报价单
    const initializeDefaultQuotation = async () => {
        if (!initialized && !component.selectedQuotationId) {
            try {
                const quotations = await quotationService.getAllQuotations();
                const defaultQuotation = quotations.find(q => q.isDefault && q.status === 'active');
                if (defaultQuotation) {
                    // 这里我们直接加载默认报价单的详情，而不是设置ID
                    // 因为在设计器中我们想要立即显示内容
                    await loadQuotationDetail(defaultQuotation._id);
                }
            } catch (error) {
                console.error('初始化默认报价单失败:', error);
            } finally {
                setInitialized(true);
            }
        }
    };

    // 加载价格政策数据
    const loadPoliciesData = async () => {
        try {
            const response = await fetch('/api/pricing-policies');
            const data = await response.json();
            const policies = data.success ? data.data : data;
            setAllPolicies(policies);
        } catch (error) {
            console.error('加载价格政策数据失败:', error);
        }
    };

    // 获取政策详情
    const getPolicyById = (policyId: string) => {
        return allPolicies.find(p => p._id === policyId);
    };

    // 处理政策点击事件
    const handlePolicyClick = (policyId: string, service?: any) => {
        const policy = getPolicyById(policyId);
        if (policy && component.policyDetailMode === 'modal') {
            setSelectedPolicy(policy);
            setSelectedPolicyService(service);
            setPolicyModalVisible(true);
        }
    };

    // 渲染政策详情文本（使用计算器逻辑）
    const formatPolicyDetail = (policy: any, service?: any, mode: 'hover' | 'modal' | 'append' = 'hover') => {
        if (!policy) return '';

        // 悬停模式只显示计费方式说明，不显示具体价格计算
        if (mode === 'hover') {
            return formatPolicyDescription(policy, service);
        }

        // 附加模式也只显示计费方式说明，适合嵌入到价格说明中
        if (mode === 'append') {
            return formatPolicyDescription(policy, service);
        }

        // 弹窗模式使用完整的价格计算
        if (service && service.unitPrice) {
            const quantity = 1; // 默认数量为1
            const originalPrice = service.unitPrice * quantity;

            const calculationResult = calculatePriceWithPolicies(
                originalPrice,
                quantity,
                [policy],
                [policy._id],
                service.unit || '项'
            );

            // 使用计算器的格式化方法
            if (calculationResult.appliedPolicy) {
                return formatCalculationDetails(calculationResult);
            }
        }

        // 回退到简单格式
        return formatPolicyDescription(policy, service);
    };

    // 为价格说明附加政策详情（返回JSX元素）
    const renderPriceDescriptionWithPolicy = (originalDescription: string, service: any) => {
        const hasOriginalDescription = originalDescription && originalDescription !== '—';

        // 检查是否需要显示政策详情
        const shouldShowPolicy = component.policyDetailMode === 'append' &&
            component.showPricingPolicy &&
            service.pricingPolicyNames &&
            service.pricingPolicyNames.length > 0;

        if (!shouldShowPolicy) {
            return hasOriginalDescription ? originalDescription : '—';
        }

        const policyDetails = service.pricingPolicyNames.map((policyName: string) => {
            const policyId = service.pricingPolicyIds?.[service.pricingPolicyNames.indexOf(policyName)] || '';
            const policy = getPolicyById(policyId);
            if (policy) {
                const detailContent = formatPolicyDetail(policy, service, 'append');
                return detailContent.replace(/<br\/?>/g, ' ');
            }
            return '';
        }).filter((detail: string) => detail).join('；');

        // 返回JSX元素，确保换行
        if (!hasOriginalDescription) {
            return policyDetails;
        }

        return (
            <>
                {originalDescription}
                <br />
                {policyDetails}
            </>
        );
    };

    // 格式化政策描述（仅计费方式，不包含价格计算）
    const formatPolicyDescription = (policy: any, service?: any) => {
        if (!policy) return '';

        let description = '';

        if (policy.type === 'uniform_discount') {
            // 统一折扣：只显示计费方式
            description = `优惠说明: 按${policy.discountRatio || 100}%计费`;
        } else if (policy.type === 'tiered_discount' && policy.tierSettings) {
            // 阶梯折扣：显示阶梯计费说明
            const unit = service?.unit || '项';
            const tierDescriptions = policy.tierSettings.map((tier: any) => {
                const startQuantity = tier.startQuantity || 0;
                const endQuantity = tier.endQuantity;
                const discountRatio = tier.discountRatio || 0;

                if (startQuantity === endQuantity) {
                    return `第${startQuantity}${unit}按${discountRatio}%计费`;
                } else if (endQuantity === undefined || endQuantity === null || endQuantity === Infinity) {
                    return `${startQuantity}${unit}及以上按${discountRatio}%计费`;
                } else {
                    return `${startQuantity}-${endQuantity}${unit}按${discountRatio}%计费`;
                }
            }).join('，');

            description = `优惠说明: ${tierDescriptions}`;
        } else {
            description = `类型：${policy.type === 'uniform_discount' ? '统一折扣' : '阶梯折扣'}`;
            if (policy.summary) {
                description += `，说明：${policy.summary}`;
            }
        }

        return description;
    };

    // 渲染价格政策标签
    const renderPolicyTag = (policyName: string, policyId: string, index: number, service: any, style: any = {}) => {
        const detailMode = component.policyDetailMode || 'hover';
        const policy = getPolicyById(policyId);

        const tagElement = (
            <div
                key={index}
                style={{
                    backgroundColor: '#fff2f0',
                    color: '#f5222d',
                    border: '1px solid #ffa39e',
                    padding: style.padding || '2px 6px',
                    borderRadius: style.borderRadius || '4px',
                    fontSize: style.fontSize || '10px',
                    fontWeight: 500,
                    marginBottom: style.marginBottom || '0',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    cursor: detailMode === 'modal' ? 'pointer' : 'default',
                    ...style
                }}
                onClick={() => detailMode === 'modal' && handlePolicyClick(policyId, service)}
            >
                {policyName}
            </div>
        );

        if (detailMode === 'hover' && policy) {
            const detailContent = formatPolicyDetail(policy, service, 'hover');
            return (
                <Tooltip
                    key={index}
                    title={
                        <div>
                            <div><strong>{policy.name}</strong></div>
                            <div style={{ marginTop: '4px', fontSize: '12px', maxWidth: '300px' }}>
                                {detailContent}
                            </div>
                        </div>
                    }
                    placement="topRight"
                    overlayStyle={{ maxWidth: '350px' }}
                >
                    {tagElement}
                </Tooltip>
            );
        }

        return tagElement;
    };

    // 当选择的报价单ID发生变化时，重新加载详情
    useEffect(() => {
        if (component.selectedQuotationId) {
            loadQuotationDetail(component.selectedQuotationId);
        } else if (!initialized) {
            // 只在未初始化时尝试加载默认报价单
            initializeDefaultQuotation();
        } else {
            setSelectedQuotation(null);
        }
    }, [component.selectedQuotationId, initialized]);

    // 加载价格政策数据
    useEffect(() => {
        if (component.showPricingPolicy) {
            loadPoliciesData();
        }
    }, [component.showPricingPolicy]);



    // 渲染报价单详情内容
    const renderQuotationDetails = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>
                        <Text type="secondary">正在加载报价单详情...</Text>
                    </div>
                </div>
            );
        }

        if (!selectedQuotation) {
            return (
                <Empty
                    description="请在右侧属性面板中选择报价单"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        }

        // 过滤掉停用的服务
        const activeServices = selectedQuotation.services.filter(service => service.status === 'active');

        // 按分类对服务进行分组排序
        const groupedServices: { [key: string]: any[] } = {};
        activeServices.forEach(service => {
            const category = service.categoryName || '其他';
            if (!groupedServices[category]) {
                groupedServices[category] = [];
            }
            groupedServices[category].push(service);
        });

        // 按分类名称排序
        const sortedCategories = Object.keys(groupedServices).sort();

        // 获取显示模式
        const displayMode = component.quotationDisplayMode || 'card';

        // 渲染卡片模式
        const renderCardMode = () => {
            // 渲染服务卡片
            const renderServiceCard = (service: any) => (
                <Col key={service._id} span={6} style={{ marginBottom: '12px' }}>
                    <Card
                        size="small"
                        style={{
                            height: '100%',
                            border: '1px solid #f0f0f0',
                            borderRadius: component.style?.borderRadius || '8px',
                            position: 'relative'
                        }}
                        bodyStyle={{ padding: '12px' }}
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

        // 渲染选项卡模式
        const renderTabsMode = () => {
            const tabItems = sortedCategories.map(category => ({
                key: category,
                label: category,
                children: (
                    <Row gutter={[12, 12]}>
                        {groupedServices[category].map(service => (
                            <Col key={service._id} span={8} style={{ marginBottom: '12px' }}>
                                <Card
                                    size="small"
                                    style={{
                                        height: '100%',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: component.style?.borderRadius || '8px',
                                        position: 'relative'
                                    }}
                                    bodyStyle={{ padding: '12px' }}
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
                        ))}
                    </Row>
                )
            }));

            return <Tabs items={tabItems} />;
        };

        // 渲染列表模式
        const renderListMode = () => {
            const columns = [
                {
                    title: '服务名称',
                    dataIndex: 'serviceName',
                    key: 'serviceName',
                    width: '25%',
                    render: (text: string, record: any) => (
                        <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text strong style={{ fontSize: '14px', color: '#262626' }}>
                                {text}
                            </Text>
                            {/* 价格政策标签 */}
                            {component.showPricingPolicy && record.pricingPolicyNames && record.pricingPolicyNames.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                    {record.pricingPolicyNames.slice(0, 2).map((policyName: string, index: number) => {
                                        const policyId = record.pricingPolicyIds?.[record.pricingPolicyNames.indexOf(policyName)] || '';
                                        return renderPolicyTag(policyName, policyId, index, record, {
                                            padding: '1px 4px',
                                            borderRadius: '3px',
                                            fontSize: '9px'
                                        });
                                    })}
                                    {record.pricingPolicyNames.length > 2 && (
                                        <div
                                            style={{
                                                backgroundColor: '#f5f5f5',
                                                color: '#8c8c8c',
                                                border: '1px solid #d9d9d9',
                                                padding: '1px 4px',
                                                borderRadius: '3px',
                                                fontSize: '9px',
                                                fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                lineHeight: '1.2'
                                            }}
                                        >
                                            +{record.pricingPolicyNames.length - 2}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                },
                {
                    title: '单价',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    width: '20%',
                    align: 'right' as const,
                    render: (price: number, record: any) => (
                        <div style={{ padding: '4px 0', textAlign: 'right' }}>
                            <Text strong style={{
                                fontSize: '14px',
                                color: '#1890ff',
                                fontFamily: 'Monaco, Consolas, monospace'
                            }}>
                                ¥{price.toLocaleString()}
                            </Text>
                            {record.unit && (
                                <Text style={{
                                    fontSize: '12px',
                                    color: '#8c8c8c',
                                    marginLeft: '2px'
                                }}>
                                    /{record.unit}
                                </Text>
                            )}
                        </div>
                    )
                },
                {
                    title: '价格说明',
                    dataIndex: 'priceDescription',
                    key: 'priceDescription',
                    width: '55%',
                    render: (text: string, record: any) => {
                        return (
                            <div style={{ padding: '4px 0' }}>
                                <Text style={{
                                    fontSize: '12px',
                                    color: '#595959',
                                    lineHeight: '1.5'
                                }}>
                                    {renderPriceDescriptionWithPolicy(text, record)}
                                </Text>
                            </div>
                        );
                    }
                }
            ];

            return (
                <>
                    {sortedCategories.map((category, categoryIndex) => (
                        <div key={category} style={{ marginBottom: '32px' }}>
                            {sortedCategories.length > 1 && (
                                <div style={{
                                    marginBottom: '16px',
                                    paddingBottom: '8px',
                                    borderBottom: `2px solid #1890ff`,
                                    width: 'fit-content'
                                }}>
                                    <Text strong style={{
                                        fontSize: '16px',
                                        color: '#1890ff',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {category}
                                    </Text>
                                </div>
                            )}

                            <Table
                                dataSource={groupedServices[category]}
                                columns={columns}
                                rowKey="_id"
                                pagination={false}
                                size="middle"
                                scroll={{ x: 'max-content' }}
                                showHeader={categoryIndex === 0}
                                className="quotation-table"
                                style={{
                                    backgroundColor: '#fafafa',
                                    borderRadius: component.style?.borderRadius || '8px',
                                    overflow: 'hidden'
                                }}
                                rowClassName={(record, index) =>
                                    index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                                }
                            />

                            {categoryIndex < sortedCategories.length - 1 && (
                                <Divider style={{
                                    margin: '24px 0',
                                    borderColor: '#e8e8e8'
                                }} />
                            )}
                        </div>
                    ))}

                    <style>{`
                        .quotation-table .ant-table-thead > tr > th {
                            background-color: #f0f2f5 !important;
                            border-bottom: 2px solid #e8e8e8 !important;
                            font-weight: 600 !important;
                            color: #262626 !important;
                            padding: 12px 16px !important;
                        }
                        
                        .quotation-table .ant-table-tbody > tr > td {
                            border-bottom: 1px solid #f0f0f0 !important;
                            padding: 12px 16px !important;
                            transition: background-color 0.2s;
                        }
                        
                        .quotation-table .table-row-even > td {
                            background-color: #ffffff !important;
                        }
                        
                        .quotation-table .table-row-odd > td {
                            background-color: #fafafa !important;
                        }
                        
                        .quotation-table .ant-table-tbody > tr:hover > td {
                            background-color: #e6f7ff !important;
                        }
                        
                        .quotation-table .ant-table {
                            border: 1px solid #e8e8e8;
                            border-radius: ${component.style?.borderRadius || '8px'};
                        }
                        
                        .quotation-table .ant-table-container {
                            border-radius: ${component.style?.borderRadius || '8px'};
                        }
                    `}</style>
                </>
            );
        };

        // 渲染内容
        const renderContent = () => {
            switch (displayMode) {
                case 'tabs':
                    return renderTabsMode();
                case 'list':
                    return renderListMode();
                case 'card':
                default:
                    return renderCardMode();
            }
        };

        // 根据设置决定显示的标题
        const getDisplayTitle = () => {
            const nameDisplay = component.quotationNameDisplay || 'show';

            switch (nameDisplay) {
                case 'hide':
                    return null; // 不显示标题
                case 'custom':
                    return component.customQuotationName || selectedQuotation.name;
                case 'show':
                default:
                    return selectedQuotation.name;
            }
        };

        const displayTitle = getDisplayTitle();

        return (
            <Card
                title={
                    displayTitle ? (
                        <div style={{ textAlign: 'center' }}>
                            <Text strong style={{ fontSize: '16px' }}>
                                {displayTitle}
                            </Text>
                        </div>
                    ) : undefined
                }
                size="small"
                style={{
                    width: '100%',
                    backgroundColor: component.style?.backgroundColor,
                    padding: component.style?.padding,
                    margin: component.style?.margin,
                    borderRadius: component.style?.borderRadius
                }}
            >
                {selectedQuotation.validUntil && (
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <Text type="secondary">
                                有效期至：{new Date(selectedQuotation.validUntil).toLocaleDateString()}
                            </Text>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                    </>
                )}

                {renderContent()}
            </Card>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            {renderQuotationDetails()}
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

            {/* 政策详情弹窗 */}
            <Modal
                title={selectedPolicy?.name || "价格政策详情"}
                open={policyModalVisible}
                onCancel={() => setPolicyModalVisible(false)}
                footer={null}
                width={700}
            >
                {selectedPolicy && (
                    <div>



                        {selectedPolicy.summary && selectedPolicy.type !== 'uniform_discount' && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>政策说明：</Text>
                                <Text>{selectedPolicy.summary}</Text>
                            </div>
                        )}





                        <div style={{ marginTop: '16px' }}>
                            <Text strong>计费说明：</Text>
                            <div style={{ marginTop: '8px' }}>
                                {selectedPolicy.type === 'uniform_discount' ? (
                                    // 统一折扣显示
                                    <div
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '6px',
                                            border: '1px solid #d9d9d9',
                                            fontSize: '14px',
                                            color: '#666'
                                        }}
                                    >
                                        统一按照{selectedPolicy.discountRatio || 100}%计费
                                    </div>
                                ) : (
                                    // 阶梯折扣显示
                                    selectedPolicy.tierSettings && selectedPolicy.tierSettings.length > 0 && (
                                        (() => {
                                            // 使用PricePolicyCalculator的逻辑生成计费说明
                                            // 使用触发弹窗的服务的单位，如果没有则默认为'项'
                                            const unit = selectedPolicyService?.unit || '项';
                                            const sortedTiers = [...selectedPolicy.tierSettings].sort((a: any, b: any) => (a.startQuantity || 0) - (b.startQuantity || 0));
                                            return sortedTiers.map((tier: any, index: number) => {
                                                const startQuantity = tier.startQuantity || 0;
                                                const endQuantity = tier.endQuantity;
                                                const discountRatio = tier.discountRatio || 0;

                                                let description = '';
                                                if (startQuantity === endQuantity) {
                                                    description = `第${startQuantity}${unit}按${discountRatio}%计费`;
                                                } else if (endQuantity === undefined || endQuantity === null || endQuantity === Infinity) {
                                                    description = `${startQuantity}${unit}及以上按${discountRatio}%计费`;
                                                } else {
                                                    description = `${startQuantity}-${endQuantity}${unit}按${discountRatio}%计费`;
                                                }

                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            marginBottom: index < sortedTiers.length - 1 ? '6px' : '0',
                                                            padding: '8px 12px',
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: '6px',
                                                            border: '1px solid #d9d9d9',
                                                            fontSize: '14px',
                                                            color: '#666'
                                                        }}
                                                    >
                                                        {description}
                                                    </div>
                                                );
                                            });
                                        })()
                                    )
                                )}
                            </div>

                            {/* 政策有效期 */}
                            <div style={{
                                marginTop: '8px',
                                padding: '6px 12px',
                                backgroundColor: selectedPolicy.validUntil ? '#fff7e6' : '#f6ffed',
                                borderRadius: '4px',
                                border: selectedPolicy.validUntil ? '1px solid #ffd591' : '1px solid #b7eb8f',
                                fontSize: '14px',
                                color: selectedPolicy.validUntil ? '#d48806' : '#52c41a'
                            }}>
                                {selectedPolicy.validUntil
                                    ? `政策有效期至：${new Date(selectedPolicy.validUntil).toLocaleDateString()}`
                                    : '政策有效期：永久有效'
                                }
                            </div>
                        </div>

                        {/* 使用价格计算器展示详细的价格计算 */}
                        <div style={{ marginTop: '16px' }}>
                            <Text strong>价格计算示例：</Text>
                            <div style={{ marginTop: '8px' }}>
                                {(() => {
                                    const unitPrice = selectedPolicyService?.unitPrice || 1000;
                                    const unit = selectedPolicyService?.unit || "项";
                                    const calculationResult = calculatePriceWithPolicies(
                                        unitPrice * 25,
                                        25,
                                        [selectedPolicy],
                                        [selectedPolicy._id],
                                        unit
                                    );

                                    return (
                                        <div>
                                            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                                                以25{unit}为例
                                            </div>
                                            <div style={{
                                                backgroundColor: '#f6ffed',
                                                padding: 8,
                                                borderRadius: 4,
                                                border: '1px solid #b7eb8f',
                                                fontSize: '14px',
                                                lineHeight: 1.6
                                            }}>
                                                {calculationResult.appliedPolicy?.type === 'tiered_discount' ? (
                                                    <div dangerouslySetInnerHTML={{
                                                        __html: calculationResult.calculationDetails
                                                            .replace(/^优惠说明:.*?<br\/><br\/>/i, '') // 移除开头的优惠说明
                                                            .replace(/计费方式:<br\/>/i, '') // 移除计费方式标题
                                                    }} />
                                                ) : (
                                                    <div>
                                                        折扣计算：¥{unitPrice.toLocaleString()} × 25{unit} × {calculationResult.discountRatio}% = ¥{calculationResult.discountedPrice.toLocaleString()}<br />
                                                        原价: ¥{calculationResult.originalPrice.toLocaleString()}<br />
                                                        优惠金额: ¥{calculationResult.discountAmount.toLocaleString()}<br />
                                                        最终价格: ¥{calculationResult.discountedPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default QuotationComponent; 