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
    onServiceQuantityChange?: (serviceId: string, quantity: number) => void;
    onPricingPolicyChange?: (serviceId: string, policyIds: string[]) => void;
}

const OrderTab: React.FC<OrderTabProps> = ({ selectedClient, selectedServices, projectData, selectedContacts, enterprises = [], designers = [], onServiceQuantityChange, onPricingPolicyChange }) => {
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

    // 表格列定义
    const columns = [
        {
            title: '服务项目',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (text: string, record: any) => (
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
                    {record.alias && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.alias}</Text>
                    )}
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
                <div style={{ textAlign: 'right' }}>
                    <Text type="danger" strong>¥{price}</Text>
                    <div style={{ fontSize: '12px', color: '#999' }}>/{record.unit}</div>
                </div>
            )
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number, record: any) => (
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
                                                const currentSelected = record.selectedPricingPolicies || [];
                                                const newSelected = e.target.checked
                                                    ? [...currentSelected, policyId]
                                                    : currentSelected.filter((id: string) => id !== policyId);
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
            title: '小计',
            key: 'subtotal',
            render: (record: any) => (
                <div style={{ textAlign: 'right' }}>
                    <Text type="danger" strong>¥{record.unitPrice * record.quantity}</Text>
                </div>
            )
        }
    ];

    // 计算总金额
    const totalAmount = selectedServices.reduce((sum, service) => {
        return sum + (service.unitPrice * service.quantity);
    }, 0);

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
                            <Table.Summary.Cell index={0} colSpan={4}>
                                <Text strong>总计</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                <Text type="danger" strong style={{ fontSize: '16px' }}>
                                    ¥{totalAmount}
                                </Text>
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