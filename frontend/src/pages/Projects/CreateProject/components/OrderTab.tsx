import React from 'react';
import { Form, Input, Select, Row, Col, Card, Table, Tag, Typography, Space, InputNumber, Checkbox } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface OrderTabProps {
    selectedClient: any;
    selectedServices: any[];
    projectData: any;
    selectedContacts?: any[];
    enterprises?: any[];
    designers?: any[];
    pricingPolicies?: any[];
    onServiceQuantityChange?: (serviceId: string, quantity: number) => void;
    onPricingPolicyChange?: (serviceId: string, policyIds: string[]) => void;
}

const OrderTab: React.FC<OrderTabProps> = ({ selectedClient, selectedServices, projectData, selectedContacts, enterprises = [], designers = [], pricingPolicies = [], onServiceQuantityChange, onPricingPolicyChange }) => {
    // 辅助函数：获取企业显示名称
    const getEnterpriseName = (enterpriseId: string) => {
        const enterprise = enterprises.find(e => e._id === enterpriseId);
        return enterprise ? enterprise.enterpriseName : '未选择';
    };

    // 辅助函数：获取设计师显示名称
    const getDesignerNames = (designerIds: string[]) => {
        if (!designerIds || designerIds.length === 0) return '未选择';
        return designerIds.map(id => {
            const designer = designers.find(d => d._id === id);
            return designer ? designer.realName : '未知';
        }).join(', ');
    };

    // 价格计算函数
    const calculatePrice = (service: any) => {
        const originalPrice = service.unitPrice * service.quantity;

        // 如果没有选择定价政策，返回原价
        if (!service.selectedPricingPolicies || service.selectedPricingPolicies.length === 0) {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                discountAmount: 0,
                calculationDetails: service.priceDescription || `按${service.unit}计费`
            };
        }

        // 获取选中的定价政策
        const selectedPolicy = pricingPolicies.find(p => p._id === service.selectedPricingPolicies[0]);
        if (!selectedPolicy || selectedPolicy.status !== 'active') {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                discountAmount: 0,
                calculationDetails: service.priceDescription || `按${service.unit}计费`
            };
        }

        let discountedPrice = originalPrice;
        let calculationDetails = '';

        if (selectedPolicy.type === 'uniform_discount') {
            // 统一折扣
            const discountRatio = selectedPolicy.discountRatio || 100;
            discountedPrice = (originalPrice * discountRatio) / 100;
            const discountAmount = originalPrice - discountedPrice;
            calculationDetails = `${service.priceDescription || `按${service.unit}计费`}\n\n<b>优惠</b>：￥${discountAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (selectedPolicy.type === 'tiered_discount' && selectedPolicy.tierSettings) {
            // 阶梯折扣
            const unitPrice = service.unitPrice;
            let totalDiscountedPrice = 0;
            let tierDetails: string[] = [];

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

                    let tierRange = '';
                    if (startQuantity === endQuantity) {
                        tierRange = `第${startQuantity}${service.unit}`;
                    } else if (endQuantity === Infinity) {
                        tierRange = `${startQuantity}${service.unit}及以上`;
                    } else {
                        tierRange = `第${startQuantity}-${endQuantity}${service.unit}`;
                    }

                    // 生成详细的计算公式
                    const tierDetail = `${tierRange}：￥${unitPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${tierQuantity}${service.unit} × ${discountRatio}% = ￥${tierDiscountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    tierDetails.push(tierDetail);
                    remainingQuantity -= tierQuantity;
                }
            }

            discountedPrice = totalDiscountedPrice;

            // 生成优惠说明
            let discountDescription = '';
            for (let i = 0; i < sortedTiers.length; i++) {
                const tier = sortedTiers[i];
                const startQuantity = tier.startQuantity || 0;
                const endQuantity = tier.endQuantity || Infinity;
                const discountRatio = tier.discountRatio || 100;

                if (i > 0) discountDescription += '，';

                if (startQuantity === endQuantity) {
                    discountDescription += `第${startQuantity}${service.unit}按${discountRatio}%计费`;
                } else if (endQuantity === Infinity) {
                    discountDescription += `${startQuantity}${service.unit}及以上按${discountRatio}%计费`;
                } else {
                    discountDescription += `${startQuantity}-${endQuantity}${service.unit}按${discountRatio}%计费`;
                }
            }

            calculationDetails = `${service.priceDescription || `按${service.unit}计费`}\n\n<b>优惠说明</b>: ${discountDescription}\n${tierDetails.join('\n')}\n\n<b>小计</b>：${tierDetails.map(detail => detail.split(' = ')[1]).join('+')}=￥${totalDiscountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n<b>优惠</b>：￥${(originalPrice - totalDiscountedPrice).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        const discountAmount = originalPrice - discountedPrice;

        return {
            originalPrice,
            discountedPrice,
            discountAmount,
            calculationDetails
        };
    };

    // 表格列定义
    const columns = [
        {
            title: '服务项目',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (text: string, record: any) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                </div>
            )
        },
        {
            title: '分类',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: (text: string) => (
                <Tag color="blue">{text || '未分类'}</Tag>
            )
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (price: number, record: any) => (
                <div style={{ textAlign: 'left' }}>
                    <Text type="danger" strong>¥{price}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>/{record.unit}</Text>
                </div>
            )
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <InputNumber
                        min={1}
                        max={9999}
                        value={quantity}
                        onChange={(value) => {
                            if (onServiceQuantityChange && value !== null) {
                                onServiceQuantityChange(record._id, value);
                            }
                        }}
                        style={{ width: '60px' }}
                        size="small"
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.unit}</Text>
                </div>
            )
        },
        {
            title: '定价政策',
            dataIndex: 'pricingPolicyNames',
            key: 'pricingPolicyNames',
            render: (policies: string[], record: any) => (
                <div>
                    {record.pricingPolicyIds && record.pricingPolicyIds.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {record.pricingPolicyIds.map((policyId: string, index: number) => {
                                const policyName = record.pricingPolicyNames?.[index] || '未知政策';
                                return (
                                    <Checkbox
                                        key={policyId}
                                        checked={record.selectedPricingPolicies?.includes(policyId) || false}
                                        onChange={(e) => {
                                            if (onPricingPolicyChange) {
                                                // 单选逻辑：如果勾选，则只选择当前政策；如果取消勾选，则清空选择
                                                const newSelected = e.target.checked ? [policyId] : [];
                                                onPricingPolicyChange(record._id, newSelected);
                                            }
                                        }}
                                    >
                                        <Tag color="green" style={{ fontSize: '12px' }}>
                                            {policyName}
                                        </Tag>
                                    </Checkbox>
                                );
                            })}
                        </div>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '12px' }}>无政策</Text>
                    )}
                </div>
            )
        },
        {
            title: '价格说明',
            dataIndex: 'priceDescription',
            key: 'priceDescription',
            render: (priceDescription: string, record: any) => {
                const priceResult = calculatePrice(record);
                return (
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: priceResult.calculationDetails.replace(/\n/g, '<br/>')
                            }}
                            style={{ color: '#666' }}
                        />
                    </div>
                );
            }
        },
        {
            title: '小计',
            key: 'subtotal',
            render: (record: any) => {
                const priceResult = calculatePrice(record);
                return (
                    <div style={{ textAlign: 'right' }}>
                        {priceResult.discountAmount > 0 ? (
                            <div>
                                <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>
                                    ¥{priceResult.originalPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <Text type="danger" strong>¥{priceResult.discountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            </div>
                        ) : (
                            <Text type="danger" strong>¥{priceResult.discountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        )}
                    </div>
                );
            }
        }
    ];

    // 计算总金额
    const totalAmount = selectedServices.reduce((sum, service) => {
        const priceResult = calculatePrice(service);
        return sum + priceResult.discountedPrice;
    }, 0);

    // 计算原价总额
    const originalTotalAmount = selectedServices.reduce((sum, service) => {
        return sum + (service.unitPrice * service.quantity);
    }, 0);

    // 计算总优惠金额
    const totalDiscountAmount = originalTotalAmount - totalAmount;

    return (
        <div>
            {/* 项目信息概览 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextOutlined style={{ color: '#666' }} />
                        <span>项目信息概览：{projectData?.projectName || '未填写'}</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <TeamOutlined style={{ color: '#666' }} />
                                <Text strong>客户信息</Text>
                            </div>
                            <div style={{ paddingLeft: '24px' }}>
                                <div><Text>客户名称：{selectedClient?.name || '未选择'}</Text></div>
                                <div><Text>联系人：{selectedContacts?.map(c => `${c.realName}(${c.phone})`).join(', ') || '未选择'}</Text></div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <UserOutlined style={{ color: '#666' }} />
                                <Text strong>团队信息</Text>
                            </div>
                            <div style={{ paddingLeft: '24px' }}>
                                <div><Text>承接团队：{getEnterpriseName(projectData?.undertakingTeam)}</Text></div>
                                <div><Text>主创设计师：{getDesignerNames(projectData?.mainDesigners)}</Text></div>
                                <div><Text>助理设计师：{getDesignerNames(projectData?.assistantDesigners)}</Text></div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <EditOutlined style={{ color: '#666' }} />
                                <Text strong>客户嘱托</Text>
                            </div>
                            <div style={{ paddingLeft: '24px' }}>
                                <Text>{projectData?.clientRequirements || '无'}</Text>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <EditOutlined style={{ color: '#666' }} />
                                <Text strong>备注信息</Text>
                            </div>
                            <div style={{ paddingLeft: '24px' }}>
                                <Text>{projectData?.remark || '无'}</Text>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* 已选服务项目表格 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextOutlined style={{ color: '#666' }} />
                        <span>已选服务项目</span>
                        <Tag color="blue">{selectedServices.length} 项</Tag>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Table
                    columns={columns}
                    dataSource={selectedServices}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={5}>
                                <Text strong>总计</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                {totalDiscountAmount > 0 ? (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>
                                            ¥{originalTotalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <Text type="danger" strong style={{ fontSize: '16px' }}>
                                            ¥{totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Text>
                                        <div style={{ color: '#52c41a', fontSize: '12px' }}>
                                            优惠: ¥{totalDiscountAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                ) : (
                                    <Text type="danger" strong style={{ fontSize: '16px' }}>
                                        ¥{totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                )}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} />
                        </Table.Summary.Row>
                    )}
                />
            </Card>
        </div>
    );
};

export default OrderTab; 